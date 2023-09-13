let getAppToken = async (userId: number) => {
    //TODO
    //Get the app token for the corresponding userId from our database
    return 'flJ2SP6tTayIEyF6tupNjh:APA91bGvO9e_QsWrxt5YQw6xNwHZEENioSnRJWxcNn-fQnZ2STUdM1zZvu6HfcPjjBPUtK5fbgZ0__ZAz_ZU1P2kz2fIASR6JaiwFMnOsCAT-uOhfNHdCk9p1pGFRW2tGGmh31hCpU6P'
}

export let getFcmMessage = async (solanaPayUrl: URL, userId: number, appToken: string) => {
    //get the users application token from database
    // let appToken = await getAppToken(userId);

    let fcmMessage = {
        to: appToken,
        notification: {
            title: 'Payment Authentication Needed',
            body: 'Please accept or decline this transaction',
        },
    
        data: {
            screenToOpen: 'Spend',
            title: 'Payment Authentication',
            body: JSON.stringify({
                name: 'SolanaPay url',
                url: solanaPayUrl
            }),
        }
    };

    return fcmMessage;
}