import { runDemo } from '../server/server';
import express, { Express, Request, Response } from 'express';

const PORT = 4000;
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

app.listen(4000, () => {
    console.log(`[server] Serving running on PORT ${PORT}`)
});

export default app;
