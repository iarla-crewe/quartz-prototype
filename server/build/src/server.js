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
exports.sendMessage = void 0;
const web3_js_1 = require("@solana/web3.js");
const balance_1 = require("./utils/balance");
const pay_1 = require("@solana/pay");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const message_1 = require("./utils/message");
const __1 = require("..");
var FCM = require('fcm-node');
var serverKey = require('../../quartz-prototype-v2-firebase-adminsdk-hynvz-5603bcd21a.json'); // Relative path is from Build directory's javascript
var fcm = new FCM(serverKey);
let connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)('devnet'), 'confirmed');
function sendMessage(appToken, fiat, label, location) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`\n[server] Received card authentication request for ${appToken.slice(0, 5)}...`);
        let userId = 1;
        let paymentStatus;
        let cardTokenMint = yield (0, balance_1.getCardTokenMint)(userId);
        const amountToken = yield (0, balance_1.getRequiredTokenAmount)(cardTokenMint, fiat);
        console.log("[server] Required token amount: " + amountToken);
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
        const reference = new web3_js_1.Keypair().publicKey;
        const url = (0, pay_1.encodeURL)({
            recipient,
            amount: (0, bignumber_js_1.default)(amountToken),
            splToken: cardTokenMint,
            reference,
            label,
            message: location
        });
        console.log('[server] Reference account: ' + reference);
        // Create FCM message
        let fcmMessage = yield (0, message_1.getFcmMessage)(url, fiat, userId, appToken, __1.RESPONSE_TIME_LIMIT);
        // Send transaction notification to user for approval
        yield fcm.send(fcmMessage, function (err, response) {
            if (err) {
                console.error("[server] Failed to send app notification: " + err);
                console.error('[server] ❌ Decline debit card transaction');
                return;
            }
            else
                console.log("[server] App notification successfully sent");
        });
        console.log('[server] Awaiting transaction confirmation...');
        paymentStatus = 'pending';
        const refreshInterval = 250;
        let waitTime = 0 - refreshInterval;
        let signature = "";
        // Retry until we find the transaction
        yield new Promise((resolve, reject) => {
            const interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                waitTime += refreshInterval;
                if (waitTime > __1.RESPONSE_TIME_LIMIT + __1.CONFIRMATION_TIME_BUFFER) {
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
        try {
            yield (0, pay_1.validateTransfer)(connection, signature, { recipient: balance_1.QUARTZ_SPEND_ADDRESS, amount: (0, bignumber_js_1.default)(amountToken), splToken: cardTokenMint });
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
}
exports.sendMessage = sendMessage;
