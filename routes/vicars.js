import express from 'express';
import { connectDB } from '../db/conn.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection('vicars');
    const vicars = await collection.aggregate([
      {
        $lookup: {
          from: 'deanery',
          localField: '_id',
          foreignField: 'vicariate_id',
          as: 'deaneries'
        }
      },
      {
        $unwind: {
          path: '$deaneries',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          deaneries: {
            $push: {
              name: '$deaneries.name',
              _id: '$deaneries._id',
            }
          }
        }
      }
    ]).sort({"name": 1}).toArray();
    res.status(200).json(vicars);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;  