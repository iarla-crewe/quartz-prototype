import { Connection, Keypair, clusterApiUrl } from "@solana/web3.js";
import { QUARTZ_SPEND_ADDRESS, USDC_MINT_ADDRESS, checkCanAfford, getCardTokenMint, getRequiredTokenAmount } from "./balance";
import { encodeURL, createQR, findReference, FindReferenceError, validateTransfer } from '@solana/pay';
import BigNumber from 'bignumber.js';
import { getFcmMessage } from "./message";

var FCM = require('fcm-node');
var serverKey = process.env.NEXT_PUBLIC_FCM
var fcm = new FCM(serverKey);

export const RESPONSE_TIME_LIMIT = 15000;
export const CONFIRMATION_TIME_BUFFER = 10000;

let connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

let sendMessage = async (appToken: string, fiatAmount: number, label: string, location: string)  => {
    let userId = 1;
    let paymentStatus: string;

    console.log("Fiat amount: ", fiatAmount);
    let cardTokenMint = await getCardTokenMint(userId);
    console.log("Card token mint: ", cardTokenMint);
    const amountToken = await getRequiredTokenAmount(cardTokenMint, fiatAmount);
    console.log("Amount token: ", amountToken);

    console.log("[server] Checking if user can afford transaction...")
    let canAfford = await checkCanAfford(connection, cardTokenMint, amountToken, userId);

    if (!canAfford) {
        console.log("[server] Transaction not accepted: Insufficent funds");
        console.log('[server] ❌ Decline debit card transaction');
        return
    }

    //creates a payment link
    console.log('[server] 💰 Create a payment request link \n');
    const recipient = QUARTZ_SPEND_ADDRESS
    const amount = new BigNumber(fiatAmount);
    const reference = new Keypair().publicKey
    const message = `${location}`;
    const splToken = USDC_MINT_ADDRESS;
    const url = encodeURL({ recipient, amount, splToken, reference, label, message });

    //creates the fcm message
    let fcmMessage = await getFcmMessage(url, fiatAmount, userId, appToken, RESPONSE_TIME_LIMIT);

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

    const refreshInterval = 250;
    let waitTime = 0 - refreshInterval;
    let sig = "";


    let signatureInfo;


    const signature = await new Promise<String>((resolve, reject) => {

        const interval = setInterval(async () => {
            waitTime += refreshInterval;

            if (waitTime > RESPONSE_TIME_LIMIT + CONFIRMATION_TIME_BUFFER) {
                paymentStatus = 'timeout';
                clearInterval(interval);
                reject();
            }
            if (waitTime % 1000 == 0) console.log(`[server] ${waitTime / 1000}s`);

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
        }, refreshInterval);
    }).catch((error) => {
        console.log("[server] Error finding signature: ", error);
    });

    if (typeof signature !== 'string') {
        console.log("[server] Decline transaction ❌");
        return
    }

    // Update payment status
    paymentStatus = 'confirmed';


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

export async function runDemo(appToken: string ,fiat: number, label: string, location: string) {
    sendMessage(appToken, fiat, label, location).then(
        () => process.exit(),
        (err) => {
            console.error("[server] " + err);
            process.exit(-1);
        }
    );
}