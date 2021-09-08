import app from './app'

const PORT = process.env.PORT || 3100;

app.listen(PORT, () => {
  console.log(`api.bken.io listening on port ${PORT}!`);
})
