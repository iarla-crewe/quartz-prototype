import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { QUARTZ_SPEND_ADDRESS, USDC_MINT_ADDRESS, checkCanAfford, getCardTokenMint, getRequiredTokenAmount } from "./utils/balance";
import { encodeURL, createQR, findReference, FindReferenceError, validateTransfer } from '@solana/pay';
import BigNumber from 'bignumber.js';
import { getFcmMessage } from "./utils/message";
import { CONFIRMATION_TIME_BUFFER, RESPONSE_TIME_LIMIT } from "..";

var FCM = require('fcm-node');
var serverKey = require('../../quartz-prototype-v2-firebase-adminsdk-hynvz-5603bcd21a.json'); // Relative path is from Build directory's javascript
var fcm = new FCM(serverKey);

let connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

export async function sendMessage(appToken: string, fiat: number, label: string, location: string) {
    console.log(`\n[server] Received card authentication request for ${appToken.slice(0, 5)}...`);

    let userId = 1;
    let paymentStatus: string;

    let cardTokenMint = await getCardTokenMint(userId);
    const amountToken = await getRequiredTokenAmount(cardTokenMint, fiat);
    console.log("[server] Required token amount: " + amountToken);

    console.log("[server] Checking if user can afford transaction...");
    let canAfford = await checkCanAfford(connection, cardTokenMint, amountToken, userId);

    if (!canAfford) {
        console.log('[server] Insufficient funds for transaction');
        console.log('[server] ❌ Decline debit card transaction');
        return;
    }

    console.log("[server] User has sufficient funds");
    console.log('[server] Creating payment request link...');
    const recipient = QUARTZ_SPEND_ADDRESS
    const reference = new Keypair().publicKey;
    const url = encodeURL({ 
        recipient, 
        amount: BigNumber(amountToken), 
        splToken: cardTokenMint, 
        reference, 
        label, 
        message: location 
    });
    console.log('[server] Reference account: ' + reference);

    // Create FCM message
    let fcmMessage = await getFcmMessage(url, fiat, userId, appToken, RESPONSE_TIME_LIMIT);

    // Send transaction notification to user for approval
    await fcm.send(fcmMessage, function (err: any, response: any) {
        if (err) {
            console.error("[server] Failed to send app notification: " + err);
            console.error('[server] ❌ Decline debit card transaction');
            return;
        }
        else console.log("[server] App notification successfully sent");
    });

    console.log('[server] Awaiting transaction confirmation...');
    paymentStatus = 'pending';

    const refreshInterval = 250;
    let waitTime = 0 - refreshInterval;
    let signature = "";

    // Retry until we find the transaction
    await new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
            waitTime += refreshInterval;

            if (waitTime > RESPONSE_TIME_LIMIT + CONFIRMATION_TIME_BUFFER) {
                paymentStatus = 'timeout';
                clearInterval(interval);
                reject();
            }
            if (waitTime % 1000 == 0) console.log(`[server] ${waitTime / 1000}s`);

            try {
                const signatureInfo = await findReference(connection, reference, { finality: 'confirmed' });

                clearInterval(interval);
                resolve(signatureInfo.signature);
            } catch (error: any) {
                if (!(error instanceof FindReferenceError)) {
                    clearInterval(interval);
                    reject(error);
                }
            }
        }, refreshInterval);
    }).then((sig) => {
        if (typeof sig === 'string') {
            signature = sig;
            console.log('\n[server] Signature found: ', signature);
        } else console.error("[server] Error: Invalid signature");
    }).catch((error) => {
        if (paymentStatus === "timeout") console.log("[server] Time limit exceeded");
        else console.error("[server] Error: findReference() failed: " + error);
    });

    if (signature === "") {
        console.log('[server] ❌ Decline debit card transaction');
        return;
    }

    paymentStatus = 'confirmed';

    try {
        await validateTransfer(connection, signature, { recipient: QUARTZ_SPEND_ADDRESS, amount: BigNumber(amountToken), splToken: cardTokenMint });

        // Update payment status
        paymentStatus = 'validated';
        console.log('[server] Payment validated');
        console.log('[server] ✅ Accept debit card transaction');
    } catch (error) {
        console.error('[server] Payment failed: ', error);
        console.error('[server] ❌ Decline debit card transaction');
    }
}
