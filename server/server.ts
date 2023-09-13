import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { QUARTZ_SPEND_ADDRESS, USDC_MINT_ADDRESS, checkCanAfford } from "./utils/balance";
import { encodeURL, createQR, findReference, validateTransfer, FindReferenceError } from '@solana/pay';
import BigNumber from 'bignumber.js';
import { getFcmMessage } from "./utils/message";

var FCM = require('fcm-node');
var serverKey = 'AAAAU4oYkts:APA91bEtoOdO75uTHC_3PaYUjUTyaIYzjJRZtxxIGShTnx5zSksEZClUQ0lyTEu4l86yg2Y57cmXD-wlcKj2s9j1k-z0up7ZyppcJLvkG8GNRqiKtdiZkh4D3aFKtkicevsChnc_H1qc';
var fcm = new FCM(serverKey);


let connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

let main = async (appToken: string) => {
    let userId = 1;
    let transactionAmount = 2
    let paymentStatus: string;

    //checks if the user can afford the transaction
    let canAfford = await checkCanAfford(connection, transactionAmount, userId);

    if (canAfford!) {
        console.log("transaction not accepted: Insufficent funds");
        return
    }

    //creates a payment link
    console.log('💰 Create a payment request link \n');
    const recipient = QUARTZ_SPEND_ADDRESS
    const amount = new BigNumber(transactionAmount);
    const reference = new Keypair().publicKey;
    const label = 'Impala';
    const message = `Impala - €${transactionAmount}`;
    const splToken = USDC_MINT_ADDRESS;
    const url = encodeURL({ recipient, amount, splToken, reference, label, message });

    //creates the fcm message
    let fcmMessage = getFcmMessage(url, userId, appToken);

    //sends notification with transaction to user to accept a payment
    fcm.send(fcmMessage, function (err: any, response: any) {
        if (err) {
            console.log("Something has gone wrong!" + err);
            console.log("Respponse:! " + response);
        } else {
            // showToast("Successfully sent with response");
            console.log("Successfully sent with response: ", response);
        }

    });
    //update payment status
    paymentStatus = 'pending';

    console.log('\n5. Find the transaction');
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
            console.count('Checking for transaction...');
            try {
                signatureInfo = await findReference(connection, reference, { finality: 'confirmed' });
                console.log('\n 🖌  Signature found: ', signatureInfo.signature);
                clearInterval(interval);
                resolve(signatureInfo.signature);
            } catch (error: any) {
                if (!(error instanceof FindReferenceError)) {
                    console.error(error);
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
    console.log('\n6. 🔗 Validate transaction \n');

    try {
        await validateTransfer(connection, signature, { recipient: QUARTZ_SPEND_ADDRESS, amount });

        // Update payment status
        paymentStatus = 'validated';
        console.log('✅ Payment validated');
        console.log('💳 Accept debit card transaction');
    } catch (error) {
        console.error('❌ Payment failed', error);
    }

}

export async function runDemo(appToken: string) {
    main(appToken).then(
        () => process.exit(),
        (err) => {
            console.error(err);
            process.exit(-1);
        }
    );
}

