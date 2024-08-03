import express from "express";
import { connectDB } from "../db/conn.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("users");
    let results = await collection
      .aggregate([
        {
          $lookup: {
            from: "institutions",
            localField: "institution_id",
            foreignField: "_id",
            as: "institution",
          },
        },
        {
          $unwind: {
            path: "$institution",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            isLeader: true,

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
            area: { $first: "$area" } 
          },
        },
        {
          $sort: {
            first_name: 1,
          },
        },
      ])
      .toArray();

    
    const dataTotalInscriptions = results.filter(user => user.saturday === true);
    const dataAssistancesRaw = results.filter(user => user)

    const areas = [
      "COMUNICACIONES",
      "Coro Juvenil Arquidiocesano",
      "Animación y adoración ",
      "DANZA",
      "REGISTRO Y ESTADÍSTICA"
    ];

  
    const areaCounts = areas.reduce((acc, area) => {
      acc[area] = dataTotalInscriptions.filter(user => user.area === area).length;
      return acc;
    }, {});

    const areaCountsAssitances = areas.reduce((acc, area) => {
      acc[area] = dataAssistancesRaw.filter(user => user.area === area).length;
      return acc;
    }, {});

    const labelsTotalInscriptions = Object.keys(areaCounts);
    const dataTotalInscriptionsPerArea = Object.values(areaCounts);


    const dataAssistances = Object.values(areaCountsAssitances);
    
    const labelsAssistances = Object.keys(areaCountsAssitances);

    const resultsGraphs = [
      {
        data: dataTotalInscriptionsPerArea, 
        labels: labelsTotalInscriptions    
      },
      {
        data: dataAssistances, 
        labels: labelsAssistances   
      },

    ];

    console.log(results);
    console.log("Get list of users successfully");
    res.status(200).json(resultsGraphs);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
