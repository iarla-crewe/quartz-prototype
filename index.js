const express = require('express')

const PORT = 4000
const app = express()

app.use(express.json());

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})

app.post('/api-demo', (req, res) => {
    const { destination } = req.body;

    if (!destination) {
        res.status(400).send({message: "destination is required"});
    }

    sendNotification(destination);
    res.send({
        status: 'success'
    })
});

module.exports = app