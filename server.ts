const firebaseKey = 'AAAAU4oYkts:APA91bEtoOdO75uTHC_3PaYUjUTyaIYzjJRZtxxIGShTnx5zSksEZClUQ0lyTEu4l86yg2Y57cmXD-wlcKj2s9j1k-z0up7ZyppcJLvkG8GNRqiKtdiZkh4D3aFKtkicevsChnc_H1qc';

const FCM = require('fcm-node');
const fcm = new FCM(firebaseKey);

export function sendNotification (destination: string) {
    const notification = {
        to: destination,
        notification: {
            title: 'Payment Authentication Needed',
            body: 'Please accept or decline this pending transaction',
        },
        data: {
            screenToOpen: 'Spend',
            title: 'Payment Authentication',
            body: JSON.stringify({
                name: 'SolanaPay url',
                url: 'http://dummysolanapay.com',
                timeSent: '22:12',
            }),
        }
    };
    
    fcm.send(notification, function (err: any, response: any) {
        if (err) {
            console.log("Something has gone wrong!" + err);
            console.log("Respponse:! " + response);
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
};
