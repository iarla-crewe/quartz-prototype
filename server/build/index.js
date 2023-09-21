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
    const { appToken, fiat, label, location } = req.body;
    if (!appToken)
        return res.status(400).send({ message: "AppToken is required" });
    if (!fiat)
        return res.status(400).send({ message: "Fiat amount required" });
    try {
        Number(fiat);
    }
    catch (_a) {
        return res.status(400).send({ message: "Invalid fiat amount" });
    }
    if (!label)
        return res.status(400).send({ message: "Label is required" });
    if (!location)
        return res.status(400).send({ message: "Location is required" });
    (0, server_1.runDemo)(appToken, fiat, label, location);
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
    console.log(`[server] API listening on PORT ${PORT} `);
});
module.exports = app;
