import { TransferRequestURL, parseURL } from "@solana/pay";

let getAppToken = async (userId: number) => {
    //TODO
    //Get the app token for the corresponding userId from our database
    return 'flJ2SP6tTayIEyF6tupNjh:APA91bGvO9e_QsWrxt5YQw6xNwHZEENioSnRJWxcNn-fQnZ2STUdM1zZvu6HfcPjjBPUtK5fbgZ0__ZAz_ZU1P2kz2fIASR6JaiwFMnOsCAT-uOhfNHdCk9p1pGFRW2tGGmh31hCpU6P'
}

export let getFcmMessage = async (solanaPayUrl: URL, userId: number, appToken: string) => {
    //get the users application token from database
    // let appToken = await getAppToken(userId);
    
    const stringUrl = stringifyURL(solanaPayUrl);

    let fcmMessage = {
        to: appToken,
        notification: {
            title: 'Payment Authentication Needed',
            body: 'Please accept or decline this transaction',
        },
        data: {
            screenToOpen: 'SpendFlow',
            title: 'Payment Authentication',
            urlObj: stringUrl
        }
    };

    return fcmMessage;
}

function stringifyURL(url: URL) {
    let object = {
        href: url.href,
        origin: url.origin,
        protocol: url.protocol,
        username: url.username,
        password: url.password,
        host: url.host,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        searchParams: Object.fromEntries(url.searchParams),
        hash: url.hash,
    };
    return JSON.stringify(object);
}