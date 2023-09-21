"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDemo = void 0;
const web3_js_1 = require("@solana/web3.js");
const balance_1 = require("./utils/balance");
const pay_1 = require("@solana/pay");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const message_1 = require("./utils/message");
var FCM = require('fcm-node');
var serverKey = require('../../quartz-prototype-v2-firebase-adminsdk-hynvz-5603bcd21a.json'); // Relative path is from Build directory's javascript
var fcm = new FCM(serverKey);
let connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)('devnet'), 'confirmed');
let sendMessage = (appToken, fiat, label, location) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`\n[server] Received card authentication request for ${appToken.slice(0, 5)}...`);
    let userId = 1;
    let paymentStatus;
    let cardTokenMint = yield (0, balance_1.getCardTokenMint)(userId);
    const amountToken = yield (0, balance_1.getRequiredTokenAmount)(cardTokenMint, fiat);
    console.log("[server] Checking if user can afford transaction...");
    let canAfford = yield (0, balance_1.checkCanAfford)(connection, cardTokenMint, amountToken, userId);
    if (!canAfford) {
        console.log('[server] Insufficient funds for transaction');
        console.log('[server] ❌ Decline debit card transaction');
        return;
    }
    console.log("[server] User has sufficient funds");
    console.log('[server] Creating payment request link...');
    const recipient = balance_1.QUARTZ_SPEND_ADDRESS;
    const amountFiat = new bignumber_js_1.default(fiat);
    const reference = new web3_js_1.Keypair().publicKey;
    const splToken = balance_1.USDC_MINT_ADDRESS;
    const url = (0, pay_1.encodeURL)({
        recipient,
        amount: amountFiat,
        splToken,
        reference,
        label,
        message: location
    });
    // Create FCM message
    let fcmMessage = yield (0, message_1.getFcmMessage)(url, userId, appToken);
    let sendTime = new Date();
    // Send transaction notification to user for approval
    yield fcm.send(fcmMessage, function (err, response) {
        if (err) {
            console.error("[server] Failed to send app notification: " + err);
            console.error('[server] ❌ Decline debit card transaction');
            return;
        }
        else
            console.log("[server] App notification successfully sent");
        console.log("[server] Notification response: " + response);
    });
    console.log('[server] Awaiting transaction confirmation...');
    paymentStatus = 'pending';
    const timeLimit = 15000;
    const refreshInterval = 250;
    let waitTime = 0 - refreshInterval;
    let signature = "";
    /**
     * Retry until we find the transaction
     *
     * If a transaction with the given reference can't be found, the `findTransactionSignature`
     * function will throw an error. There are a few reasons why this could be a false negative:
     *
     * - Transaction is not yet confirmed
     * - Customer is yet to approve/complete the transaction
     *
     * You can implement a polling strategy to query for the transaction periodically.
     */
    yield new Promise((resolve, reject) => {
        const interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            waitTime += refreshInterval;
            if (waitTime > timeLimit) {
                paymentStatus = 'timeout';
                clearInterval(interval);
                reject();
            }
            if (waitTime % 1000 == 0)
                console.log(`[server] ${waitTime / 1000}s`);
            try {
                const signatureInfo = yield (0, pay_1.findReference)(connection, reference, { finality: 'confirmed' });
                clearInterval(interval);
                resolve(signatureInfo.signature);
            }
            catch (error) {
                if (!(error instanceof pay_1.FindReferenceError)) {
                    clearInterval(interval);
                    reject(error);
                }
            }
        }), refreshInterval);
    }).then((sig) => {
        if (typeof sig === 'string') {
            signature = sig;
            console.log('\n[server] Signature found: ', signature);
        }
        else
            console.error("[server] Error: Invalid signature");
    }).catch((error) => {
        if (paymentStatus === "timeout")
            console.log("[server] Time limit exceeded");
        else
            console.error("[server] Error: findReference() failed: " + error);
    });
    if (signature === "") {
        console.log('[server] ❌ Decline debit card transaction');
        return;
    }
    paymentStatus = 'confirmed';
    /**
     * Validate transaction
     *
     * Once the `findTransactionSignature` function returns a signature,
     * it confirms that a transaction with reference to this order has been recorded on-chain.
     *
     * `validateTransactionSignature` allows you to validate that the transaction signature
     * found matches the transaction that you expected.
     */
    try {
        yield (0, pay_1.validateTransfer)(connection, signature, { recipient: balance_1.QUARTZ_SPEND_ADDRESS, amount: (0, bignumber_js_1.default)(amountToken), splToken });
        // Update payment status
        paymentStatus = 'validated';
        console.log('[server] Payment validated');
        console.log('[server] ✅ Accept debit card transaction');
    }
    catch (error) {
        console.error('[server] Payment failed: ', error);
        console.error('[server] ❌ Decline debit card transaction');
    }
});
function runDemo(appToken, fiat, label, location) {
    return __awaiter(this, void 0, void 0, function* () {
        sendMessage(appToken, fiat, label, location).then(() => process.exit(), (err) => {
            console.error("[server] " + err);
            process.exit(-1);
        });
    });
}
exports.runDemo = runDemo;
