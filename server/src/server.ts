import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { QUARTZ_SPEND_ADDRESS, USDC_MINT_ADDRESS, checkCanAfford } from "./utils/balance";
import { encodeURL, createQR, findReference, FindReferenceError, validateTransfer } from '@solana/pay';
import BigNumber from 'bignumber.js';
import { getFcmMessage } from "./utils/message";

var FCM = require('fcm-node');
var serverKey = require('../../quartz-prototype-v2-firebase-adminsdk-hynvz-5603bcd21a.json'); // Relative path is from Build directory's javascript
var fcm = new FCM(serverKey);

let connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

let sendMessage = async (appToken: string) => {
    let userId = 1;
    let transactionAmount = 0.01
    let paymentStatus: string;

    
    let foo = new PublicKey("jNFx1wSfb8CUxe8UZwfD3GnkBKvMqiUg69JHYM1Pi2G");

    console.log("[server] Checking if user can afford transaction...")
    let canAfford = await checkCanAfford(connection, transactionAmount, userId);

    if (!canAfford) {
        console.log("[server] Transaction not accepted: Insufficent funds");
        return
    }

    //creates a payment link
    console.log('[server] 💰 Create a payment request link \n');
    const recipient = QUARTZ_SPEND_ADDRESS
    const amount = new BigNumber(transactionAmount);
    const reference = new Keypair().publicKey
    const label = 'Impala';
    const message = `Washington street, Cork City, Co.Cork`;
    const splToken = USDC_MINT_ADDRESS;
    const url = encodeURL({ recipient, amount, splToken, reference, label, message });

    //creates the fcm message
    let fcmMessage = await getFcmMessage(url, userId, appToken);
    //sends notification with transaction to user to accept a payment
    await fcm.send(fcmMessage, function (err: any, response: any) {
        if (err) {
            console.log("[server] Something has gone wrong! " + err);
            console.log("[server] Response: " + response);
        } else {
            // showToast("Successfully sent with response");
            console.log("[server] Successfully sent with response: ", response);
        }

    });
    //update payment status
    paymentStatus = 'pending';

    console.log('\n[server] 5. Find the transaction');
    let signatureInfo;


    const signature: string = await new Promise((resolve, reject) => {
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
        const interval = setInterval(async () => {
            //console.count('Checking for transaction...');
            try {
                signatureInfo = await findReference(connection, reference, { finality: 'confirmed' });
                console.log('\n[server] 🖌  Signature found: ', signatureInfo.signature);
                clearInterval(interval);
                resolve(signatureInfo.signature);
            } catch (error: any) {
                if (!(error instanceof FindReferenceError)) {
                    console.error("[server]" + error);
                    clearInterval(interval);
                    reject(error);
                }
            }
        }, 250);
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
    console.log('\n[server] 6. 🔗 Validate transaction \n');

    try {
        await validateTransfer(connection, signature, { recipient: QUARTZ_SPEND_ADDRESS, amount, splToken });

        // Update payment status
        paymentStatus = 'validated';
        console.log('[server] ✅ Payment validated');
        console.log('[server] 💳 Accept debit card transaction');
    } catch (error) {
        console.error('[server] ❌ Payment failed', error);
    }
}

export async function runDemo(appToken: string) {
    sendMessage(appToken).then(
        () => process.exit(),
        (err) => {
            console.error("[server] " + err);
            process.exit(-1);
        }
    );
}
