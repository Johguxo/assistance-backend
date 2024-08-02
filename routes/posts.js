import express from 'express';
import { connectDB } from '../db/conn.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection('users');
    const results = await collection.find({})
    .limit(50)
    .toArray();
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;  


// Get a list of 50 posts
// router.get("/", async (req, res) => {
//   let collection = await db.collection("posts");
//   let results = await collection.find({})
//     .limit(50)
//     .toArray();
//   res.send(results).status(200);
// });