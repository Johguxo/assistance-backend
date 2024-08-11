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
            $or: [
              { isLeader: false },
              { isLeader: { $exists: false } },
              { isLeader: null }
            ]
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

    
    const dataTotalInscriptions = results.filter(user => user);
    const dataAssistancesRaw = results.filter(user => user.saturday === true)
    const dataAssistancesRawSunday = results.filter(user => user.sunday === true)

    const totalUsers = dataTotalInscriptions.length
    const totalAssistancesUsers = dataAssistancesRaw.length
    const totalAssistancesUsersSunday = dataAssistancesRawSunday.length

    const types = [
      1,
      2,
      3,
      4,
    ];

  
    const typeCounts = types.reduce((acc, type) => {
      acc[type] = dataTotalInscriptions.filter(user => user.institution.type === type).length;
      return acc;
    }, {});
    
    const labelsTotalInscriptions = ['Parroquias', 'Colegios', 'Universidades', 'Movimientos', 'Libres'];
    const dataTotalInscriptionsPerArea = Object.values(typeCounts);

    const typeCountsAssitances = types.reduce((acc, type) => {
      acc[type] = dataAssistancesRaw.filter(user => user.institution.type === type).length;
      return acc;
    }, {});

    const labelsAssistances = ['Parroquias', 'Colegios', 'Universidades', 'Movimientos', 'Libres'];
    const dataAssistancesPerArea = Object.values(typeCountsAssitances);

    const typeCountsAssitancesSunday = types.reduce((acc, type) => {
      acc[type] = dataAssistancesRawSunday.filter(user => user.institution.type === type).length;
      return acc;
    }, {});

    const labelsAssistancesSunday = ['Parroquias', 'Colegios', 'Universidades', 'Movimientos', 'Libres'];
    const dataAssistancesSundayPerArea = Object.values(typeCountsAssitancesSunday);

    //Next

    const sumaOtros = dataTotalInscriptionsPerArea.reduce((valorAnterior, valorActual) => {
      return valorAnterior + valorActual;
    }, 0);

    const sumaOtrosAssistentes = dataAssistancesPerArea.reduce((valorAnterior, valorActual) => {
      return valorAnterior + valorActual;
    }, 0);

    const sumaOtrosAssistentesSunday = dataAssistancesSundayPerArea.reduce((valorAnterior, valorActual) => {
      return valorAnterior + valorActual;
    }, 0);

    dataTotalInscriptionsPerArea.push(totalUsers-sumaOtros)
    dataAssistancesPerArea.push(totalAssistancesUsers-sumaOtrosAssistentes )
    dataAssistancesSundayPerArea.push(totalAssistancesUsersSunday-sumaOtrosAssistentesSunday)



    const resultsGraphs = [
      {
        data: dataAssistancesPerArea, 
        labels: labelsAssistances   
      }, {
        data: dataAssistancesSundayPerArea,
        labels: labelsAssistancesSunday
      },
      {
        data: dataTotalInscriptionsPerArea, 
        labels: labelsTotalInscriptions    
      }
    ];
    console.log("Get list stadistics of users successfully");
    res.status(200).json(resultsGraphs);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/leaders", async (req, res) => {
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
      "REGISTRO Y ESTADÍSTICA",
      "Facilitadores",
      "Producción (Logística)",
      "Seguridad"
    ];

  
    const areaCounts = areas.reduce((acc, area) => {
      acc[area] = dataTotalInscriptions.filter(user => user.area?.toLowerCase().trim() === area.toLowerCase().trim()).length;
      return acc;
    }, {});
    
    const labelsTotalInscriptions = Object.keys(areaCounts);
    const dataTotalInscriptionsPerArea = Object.values(areaCounts);

    const areaCountsAssitances = areas.reduce((acc, area) => {
      acc[area] = dataAssistancesRaw.filter(user => user.area?.toLowerCase().trim() === area.toLowerCase().trim()).length;
      return acc;
    }, {});

    const labelsAssistances = Object.keys(areaCountsAssitances);
    const dataAssistances = Object.values(areaCountsAssitances);

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
    console.log("Get list stadistics of users successfully");
    res.status(200).json(resultsGraphs);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
