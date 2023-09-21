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
let getFcmMessage = (solanaPayUrl, amountFiat, userId, appToken, timeLimit) => __awaiter(void 0, void 0, void 0, function* () {
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
