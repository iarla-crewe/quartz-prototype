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
let checkValidDestination = (req, res) => {
    const destination = req.body;
    console.log("destination: ", destination);
    if (!destination) {
        return res.status(400).send({ message: "destination is required" });
    }
    console.log("After destination check");
    (0, server_1.runDemo)(destination);
    return res.send({
        status: 'success'
    });
};
app.post('/api-demo', (req, res) => {
    checkValidDestination(req, res);
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
