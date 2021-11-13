import server from './app'

const PORT = process.env.PORT || 3100;

server.listen(PORT, () => {
  console.log(`api.bken.io listening on port ${PORT}!`);
})
