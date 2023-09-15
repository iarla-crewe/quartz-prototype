import express, { Express, Request, Response } from 'express';
import { runDemo } from './src/server';

const PORT = 4000
const app = express()

app.use(express.json());

app.post('/api-demo', (req: Request, res: Response) => {
    const { destination }: { destination: string } = req.body;

    if (!destination) {
        return res.status(400).send({ message: "destination is required" });
    }

    runDemo(destination);

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
    console.log(`API listening on PORT ${PORT} `)
})

module.exports = app

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
}

let y =  {"url": "solana:jNFx1wSfb8CUxe8UZwfD3GnkBKvMqiUg69JHYM1Pi2G?amount=2&spl-token=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU&reference=BjW6y6VQXdXYkXbJEdrbUASF9o1RCABiXD2xSXuZ2bES&label=Impala&message=Washington+street%2C+Cork+City%2C+Co.Cork"}
