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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFcmMessage = void 0;
let getAppToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO
    //Get the app token for the corresponding userId from our database
    return 'flJ2SP6tTayIEyF6tupNjh:APA91bGvO9e_QsWrxt5YQw6xNwHZEENioSnRJWxcNn-fQnZ2STUdM1zZvu6HfcPjjBPUtK5fbgZ0__ZAz_ZU1P2kz2fIASR6JaiwFMnOsCAT-uOhfNHdCk9p1pGFRW2tGGmh31hCpU6P';
});
let getFcmMessage = (solanaPayUrl, userId, appToken) => __awaiter(void 0, void 0, void 0, function* () {
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
            navigationFlow: 'Send',
            screenToOpen: 'SpendScreen',
            title: 'Payment Authentication',
            urlObj: stringUrl
        }
    };
    return fcmMessage;
});
exports.getFcmMessage = getFcmMessage;
function stringifyURL(url) {
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
