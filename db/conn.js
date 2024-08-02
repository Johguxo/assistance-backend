// import { MongoClient } from "mongodb";


// const connectionString = process.env.MONGODB_URI || "";
// const client = new MongoClient(connectionString);
// let conn;
// try {
//   conn = await client.connect();
// } catch(e) {
//   console.error(e);
// }
// let db = conn.db("sample_training");
// export default db;



import { MongoClient } from 'mongodb';

let _db = null;

async function connectDB() {
  if (!_db) {
    try {
      const connectionString = process.env.MONGODB_URI;
      const nameDB = process.env.DB_NAME;
      console.log(`Connecting to database ${connectionString} and db ${nameDB}`);

      const client = new MongoClient(connectionString, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      });

      await client.connect();

      _db = client.db("database-jaj");
    } catch (e) {
      console.log("Error:", e)
    }
    
    // const usersCollection = _db.collection('users');
    // const users = await usersCollection.find().toArray();
    // console.log('Usuarios encontrados:', users);
  }

  return _db;
}

async function ping() {
  const db = await connectDB();
  await db.command({ ping: 1 });
  console.log('Database connected');
}

export { connectDB, ping };
