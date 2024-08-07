import express from 'express';
import { connectDB } from '../db/conn.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("institutions");
      const allData = await collection
        .aggregate([
          {
            $lookup: {
              from: "deanery",
              localField: "deanery_id",
              foreignField: "_id",
              as: "deanery",
            },
          },
          {
            $unwind: {
              path: "$deanery",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: "$_id",
              name: { $first: "$name" },
              type: { $first: "$type" },
              address: { $first: "$address" },
              deanery: {
                $first: {
                  name: "$deanery.name",
                  _id: "$deanery._id",
                },
              },
            },
          },
          {
            $sort: {
              name: 1,
            },
          },
        ])
        .toArray();
      console.log("Get list of institutions sucessfully")
      res.status(200).json(allData);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post("/by-user", async (req, res) => {
  const body = req.body;

  try {
    const db = await connectDB();
    const collection = db.collection("institutions");
    const customBody = {
      ...body,
      created_by_user: true
    }
    const result = await collection.insertOne(customBody);
    const insertedInstitution = {
      _id: result.insertedId,
      ...body
    };
    console.log("Institution created sucessfully");
    res.status(201).json(insertedInstitution);
  } catch (error) {
    console.error("Error creating institution:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/by-admin", async (req, res) => {
  const body = req.body;

  try {
    const db = await connectDB();
    const collection = db.collection("institutions");
    const customBody = {
      ...body,
      created_by_admin: true
    }
    const result = await collection.insertOne(customBody);
    const insertedInstitution = {
      _id: result.insertedId,
      ...body
    };
    console.log("Institution created sucessfully");
    res.status(201).json(insertedInstitution);
  } catch (error) {
    console.error("Error creating institution:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;  