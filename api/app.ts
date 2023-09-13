import app from '.'

const PORT = 8080;
app.listen(
    PORT,
    () => console.log(`[server] Server is runnning at http://localhost:${PORT}`)
);