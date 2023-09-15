import express, { Express, Request, Response } from 'express';
import { runDemo } from './src/server';

const PORT = 4000
const app = express()

app.use(express.json());

app.post('/api-demo', (req: Request, res: Response) => {
    const { destination }: { destination: string } = req.body;

    if (!destination) {
        return res.status(400).send({message: "destination is required"});
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