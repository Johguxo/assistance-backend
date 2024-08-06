import express from "express";
import { connectDB } from "../db/conn.js";
import { ObjectId } from "mongodb";
import { getAge } from '../utils/calculates.js'

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("users");
    // let users = await collection
    let results = await collection
      .aggregate([
        {
          $lookup: {
            from: "institutions",
            localField: "institution_id", // lo cambie de institution_id a institutions
            foreignField: "_id",
            as: "institution",
          },
        },
        {
          $unwind: {
            path: "$institution",
            preserveNullAndEmptyArrays: true, // This allows users without institutions to be included
          },
        },

        {
          $group: {
            _id: "$_id",
            first_name: { $first: "$first_name" },
            last_name: { $first: "$last_name" },
            date_birth: { $first: "$date_birth" },
            institution: {
              $first: {
                name: "$institution.name",
                _id: "$institution._id",
                type: "$institution.type",
                address: "$institution.address",
                deanery_id: "$institution.deanery_id",
              },
            },
            DNI: { $first: "$DNI" },
            email: { $first: "$email" },
            key: { $first: "$key" },
            phone: { $first: "$phone" },
            have_auth: { $first: "$have_auth" },
            saturday: { $first: "$saturday" },
            sunday: { $first: "$sunday" },
          },
        },
        {
          $sort: {
            first_name: 1,
          },
        },
      ])
      .toArray();
    console.log("Get list of users sucessfully");
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/by-admin", async (req, res) => {
  const body = req.body;

  try {
    const db = await connectDB();
    const collection = db.collection("users");
    console.log(body)
    /*const { belongsToInstitution, typeInstitution, dni, phone, date_birth, ...destructuredBody } = body;
    let userBody = {
      ...destructuredBody,
      DNI: parseInt(dni),
      phone: parseInt(phone),
      date_birth: new Date(date_birth),
      age: getAge(date_birth),
      saturday: true,
      have_auth: true
    }
    
    if (body.institution) {
      const { institution, ...restBody } = userBody;
      userBody = {
        ...restBody,
        institution_id: new ObjectId(institution)
      }
    }
    const user = await collection.insertOne(userBody);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }*/
    const user = body
    console.log("User created sucessfully");
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/by-user", async (req, res) => {
  const body = req.body;

  try {
    const db = await connectDB();
    const collection = db.collection("users");
    console.log(body)
    const { belongsToInstitution, typeInstitution, dni, phone, date_birth, institution, ...destructuredBody } = body;
    let userBody = {
      ...destructuredBody,
      DNI: parseInt(dni),
      phone: parseInt(phone),
      date_birth: new Date(date_birth),
      age: getAge(date_birth)
    }

    if (belongsToInstitution === "Yes") {
      if (institution != 'default') {
        userBody = {
          ...userBody,
          institution_id: new ObjectId(institution)
        }
      }
    }

    if (userBody.age <= 18) {
      userBody = {
        ...userBody,
        have_auth: false
      }
    }

    console.log(userBody)

    /*const user = await collection.insertOne(userBody);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }*/
    const user = userBody
    console.log("User created sucessfully");
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/leaders", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("users");
    // let users = await collection
    let results = await collection
      .aggregate([
        {
          $lookup: {
            from: "institutions",
            localField: "institution_id", // lo cambie de institution_id a institutions
            foreignField: "_id",
            as: "institution",
          },
        },
        {
          $unwind: {
            path: "$institution",
            preserveNullAndEmptyArrays: true, // This allows users without institutions to be included
          },
        },
        {
          $match: {
            isLeader: true,// Filtra por el campo isLeader
          },
        },
        {
          $group: {
            _id: "$_id",
            first_name: { $first: "$first_name" },
            last_name: { $first: "$last_name" },
            date_birth: { $first: "$date_birth" },
            institution: {
              $first: {
                name: "$institution.name",
                _id: "$institution._id",
                type: "$institution.type",
                address: "$institution.address",
                deanery_id: "$institution.deanery_id",
              },
            },
            DNI: { $first: "$DNI" },
            email: { $first: "$email" },
            area: { $first: "$area" },
            key: { $first: "$key" },
            phone: { $first: "$phone" },
            have_auth: { $first: "$have_auth" },
            saturday: { $first: "$saturday" },
            sunday: { $first: "$sunday" },
          },
        },
        {
          $sort: {
            first_name: 1,
          },
        },
      ])
      .toArray();
    console.log("Get list of users sucessfully");
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leaders", async (req, res) => {
  const body = req.body;

  try {
    const db = await connectDB();
    const collection = db.collection("users");
    const { belongsToInstitution, typeInstitution, dni, phone, date_birth, ...destructuredBody } = body;
    let userBody = {
      ...destructuredBody,
      DNI: parseInt(dni),
      phone: parseInt(phone),
      date_birth: new Date(date_birth),
      age: getAge(date_birth),
      saturday: true
    }
    if (body.institution) {
      const { institution, ...restBody } = userBody;
      userBody = {
        ...restBody,
        institution_id: new ObjectId(institution)
      }
    }
    const user = await collection.insertOne(userBody);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User created sucessfully");
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const db = await connectDB();
    const collection = db.collection("users");
    const user = await collection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Getting user sucessfully");
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  try {
    const db = await connectDB();
    const collection = db.collection("users");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Update user sucessfully");
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
