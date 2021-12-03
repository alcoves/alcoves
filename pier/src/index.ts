import app from './app'
import db from './config/db'

const port = 4000

async function main() {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await db.$disconnect()
  })
