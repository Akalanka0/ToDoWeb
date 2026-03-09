const { MongoClient } = require('mongodb');
require('dotenv').config();

let client;
let db;

async function connect() {
  if (db) return db;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI not set');
  }
  client = new MongoClient(uri, {
    connectTimeoutMS: 5000,
    socketTimeoutMS: 30000,
    maxPoolSize: 10,
    minPoolSize: 2,
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    },
  });
  await client.connect();
  db = client.db();
  await db.command({ ping: 1 });
  return db;
}

process.on('SIGINT', async () => {
  if (client) {
    await client.close();
  }
  process.exit(0);
});

module.exports = { connect };
