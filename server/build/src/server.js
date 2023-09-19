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
let sendMessage = (appToken) => __awaiter(void 0, void 0, void 0, function* () {
    let userId = 1;
    let transactionAmount = 0.01;
    let paymentStatus;
    //checks if the user can afford the transaction
    let canAfford = yield (0, balance_1.checkCanAfford)(connection, transactionAmount, userId);
    if (!canAfford) {
        console.log("transaction not accepted: Insufficent funds");
        return;
    }
    //creates a payment link
    console.log('💰 Create a payment request link \n');
    const recipient = balance_1.QUARTZ_SPEND_ADDRESS;
    const amount = new bignumber_js_1.default(transactionAmount);
    const reference = new web3_js_1.Keypair().publicKey;
    const label = 'Impala';
    const message = `Washington street, Cork City, Co.Cork`;
    const splToken = balance_1.USDC_MINT_ADDRESS;
    const url = (0, pay_1.encodeURL)({ recipient, amount, splToken, reference, label, message });
    //creates the fcm message
    let fcmMessage = yield (0, message_1.getFcmMessage)(url, userId, appToken);
    //sends notification with transaction to user to accept a payment
    yield fcm.send(fcmMessage, function (err, response) {
        if (err) {
            console.log("Something has gone wrong! " + err);
            console.log("Response: " + response);
        }
        else {
            // showToast("Successfully sent with response");
            console.log("Successfully sent with response: ", response);
        }
    });
    //update payment status
    paymentStatus = 'pending';
    console.log('\n5. Find the transaction');
    let signatureInfo;
    console.log("here");
    const signature = yield new Promise((resolve, reject) => {
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
        console.log("inside");
        const interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            console.count('Checking for transaction...');
            try {
                console.log("in try");
                signatureInfo = yield (0, pay_1.findReference)(connection, reference, { finality: 'confirmed' });
                console.log('\n 🖌  Signature found: ', signatureInfo.signature);
                clearInterval(interval);
                resolve(signatureInfo.signature);
            }
            catch (error) {
                if (!(error instanceof pay_1.FindReferenceError)) {
                    console.error(error);
                    clearInterval(interval);
                    reject(error);
                }
            }
        }), 250);
    });
    // Update payment status
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
    console.log('\n6. 🔗 Validate transaction \n');
    try {
        yield (0, pay_1.validateTransfer)(connection, signature, { recipient: balance_1.QUARTZ_SPEND_ADDRESS, amount, splToken });
        // Update payment status
        paymentStatus = 'validated';
        console.log('✅ Payment validated');
        console.log('💳 Accept debit card transaction');
    }
    catch (error) {
        console.error('❌ Payment failed', error);
    }
});
function runDemo(appToken) {
    return __awaiter(this, void 0, void 0, function* () {
        sendMessage(appToken).then(() => process.exit(), (err) => {
            console.error(err);
            process.exit(-1);
        });
    });
}
exports.runDemo = runDemo;
