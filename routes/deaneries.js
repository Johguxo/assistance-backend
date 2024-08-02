import express from 'express';
import { connectDB } from '../db/conn.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("deanery");
    const allData = await collection.find({}).toArray();
    console.log("Get list of deaneries sucessfully")
    res.status(200).json(allData);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;  