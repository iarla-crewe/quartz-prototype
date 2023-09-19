"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("./src/server");
const PORT = 4000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/api-demo', (req, res) => {
    const { destination } = req.body;
    if (!destination) {
        return res.status(400).send({ message: "destination is required" });
    }
    (0, server_1.runDemo)(destination);
    return res.send({
        status: 'success'
    });
});
app.get('/', (reg, res) => {
    res.send({
        status: 'online'
    });
});
app.listen(PORT, () => {
    console.log(`API listening on PORT ${PORT} `);
});
module.exports = app;
let x = {
    "collapseKey": "com.quartzprototypev2mobileapp",
    "data": {
        "screenToOpen": "Spend",
        "title": "Payment Authentication",
        "url": "\"solana:jNFx1wSfb8CUxe8UZwfD3GnkBKvMqiUg69JHYM1Pi2G?amount=2&spl-token=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU&reference=EJeeSG7eTrqb16xJ7ZGt5dsvA6uAapkKAq7k38ovNFWb&label=Impala&message=Impala+-+%E2%82%AC2\""
    },
    "from": "358799151835",
    "messageId": "0:1694790322186343%94f0288994f02889",
    "notification": { "android": {}, "body": "Please accept or decline this transaction",
        "title": "Payment Authentication Needed" },
    "sentTime": 1694790322143,
    "ttl": 2419200
};
let y = { "url": "solana:jNFx1wSfb8CUxe8UZwfD3GnkBKvMqiUg69JHYM1Pi2G?amount=2&spl-token=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU&reference=BjW6y6VQXdXYkXbJEdrbUASF9o1RCABiXD2xSXuZ2bES&label=Impala&message=Washington+street%2C+Cork+City%2C+Co.Cork" };
