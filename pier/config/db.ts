import { Db, MongoClient } from 'mongodb'

let cachedDb: Db

export async function connectToDatabase() {
  if (cachedDb) return cachedDb
  
  // @ts-ignore
  const client: MongoClient = await MongoClient.connect(process.env.MONGODB_URI, {
    tls: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tlsCAFile: './ca-certificate.crt'
  })


  cachedDb = client.db("bken")
  return cachedDb
}