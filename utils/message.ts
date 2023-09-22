export let getFcmMessage = async (solanaPayUrl: URL, amountFiat: number, userId: number, appToken: string, timeLimit: number) => {
    
    const stringUrl = stringifyURL(solanaPayUrl);
    const fiatString = Number(amountFiat).toFixed(2);

    let fcmMessage = {
        to: appToken,
        notification: {
            title: 'Payment Authentication Needed',
            body: 'Please accept or decline this transaction',
        },
        data: {
            navigationFlow: 'Send',
            screenToOpen: 'SpendScreen',
            title: 'Payment Authentication',
            timeLimit: timeLimit.toString(),
            amountFiat: fiatString,
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