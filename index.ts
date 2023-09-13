import express, { Express, Request, Response } from 'express';
import { runDemo } from './src/server';

const PORT = 4000
const app = express()

app.use(express.json());

app.post('/api-demo', (req: Request, res: Response) => {
    const { destination } = req.body;

    if (!destination) {
        res.status(400).send({message: "destination is required"});
    }

    runDemo(destination);
    res.send({
        status: 'success'
    })
});

app.listen(PORT, () => {
    console.log(`API listening on PORT ${PORT} `)
  })

module.exports = app