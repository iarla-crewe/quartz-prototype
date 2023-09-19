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
        status: 'success',
        destination: destination
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
