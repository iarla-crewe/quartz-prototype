import express, { Request, Response } from 'express';
import { sendMessage } from './src/server';

const PORT = 4000
const app = express()

app.use(express.json());

const RESPONSE_TIME_LIMIT = 15000;

app.post('/api-demo', (req: Request, res: Response) => {
    const { appToken, fiat, label, location }: { appToken: string, fiat: number, label: string, location: string } = req.body;

    if (!appToken) return res.status(400).send({ message: "AppToken is required" });
    if (!fiat) return res.status(400).send({ message: "Fiat amount required" });
    try { Number(fiat) } catch { return res.status(400).send({ message: "Invalid fiat amount" }); }
    if (!label) return res.status(400).send({ message: "Label is required" });
    if (!location) return res.status(400).send({ message: "Location is required" });

    sendMessage(RESPONSE_TIME_LIMIT, appToken, fiat, label, location);

    return res.send({
        status: 'success'
    })
});

app.get('/', (reg: Request, res: Response) => {
    res.send({
        status: 'online'
    })
});

app.listen(PORT, () => {
    console.log(`[server] API listening on PORT ${PORT} `)
})

module.exports = app
