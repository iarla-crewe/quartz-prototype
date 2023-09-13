import { runDemo } from '../server/server';

const PORT = 4000;
const express = require('express');
const app = express();

app.use(express.json());

app.listen(4000, () => {
    console.log(`[server] Serving running on PORT ${PORT}`)
});

app.post('/api/demo', (req, res) => {
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
