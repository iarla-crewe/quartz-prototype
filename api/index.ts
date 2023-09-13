import { runDemo } from '../server/server';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app: Express = express();

app.use(express.json());

app.post('/api-demo', (req: Request, res: Response) => {
    const { destination } = req.body;

    if (!destination) {
        res.status(400).send({message: "destination is required"});
    }

    runDemo(destination);

    res.send({
        status: 'success'
    });
});

export default app;
