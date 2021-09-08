import express from 'express';

const app = express();

const PORT = 3100;

app.get('/', (req, res) => {
    res.send('Well done!');
})

app.listen(PORT, () => {
    console.log(`api.bken.io listening on port ${PORT}!`);
})
