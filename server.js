  import express from "express";
  import cors from "cors";
  import fs from "fs";
  import path from "path";
  import { fileURLToPath } from "url";
  import { dirname } from "path";
  import mongoose from "mongoose";
  import { PORT, mongoDBURL } from "./config.js";
  import doctorRoutes from './routes/doctorRoutes.js'
  const router = express.Router();
  import {Doctor} from './models/doctors.js'

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const app = express();
  const filePath = path.join(__dirname, "touch.json");

  app.use(cors());
  app.use(express.json());
  //app.use('/api/doctors', doctorRoutes);


  // GET doctors
  // app.get("/api/doctors", (req, res) => {
  //   fs.readFile(filePath, "utf-8", (err, data) => {
  //     if (err) {
  //       console.error("Failed to read file:", err);
  //       return res.status(500).json({ error: "Unable to fetch doctor data" });
  //     }

  //     const doctors = JSON.parse(data);
  //     const { location } = req.query;

  //     if (location) {
  //       const filtered = doctors.filter(
  //         (doc) => doc.location.toLowerCase() === location.toLowerCase()
  //       );
  //       return res.json(filtered);
  //     }

  //     res.json(doctors);
  //   });
  // });

  app.get("/api/doctors", async (req, res) => {
    try {
      const { location } = req.query;
      let query = {};
  
      if (location) {
        query.location = { $regex: new RegExp(location, "i") }; // case-insensitive
      }
  
      const doctors = await Doctor.find(query);
      res.json(doctors);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      res.status(500).json({ error: "Unable to fetch doctor data" });
    }
  });


  app.use('/doctor',doctorRoutes);

  // MongoDB connection
  // for inserting 
  mongoose
    .connect(mongoDBURL)
    .then(() => {
      console.log("MongoDB connected successfully");
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });

    
  // POST new doctor
  // app.post("/api/doctors", (req, res) => {
  //   const newDoctor = req.body;
  //   console.log("new doc: ", newDoctor);
  //   fs.readFile(filePath, "utf-8", (err, data) => {
  //     if (err) {
  //       console.error("Failed to read file:", err);
  //       return res.status(500).json({ error: "Unable to read doctor data" });
  //     }

  //     const doctors = JSON.parse(data);
  //     newDoctor.id = Date.now();
  //     doctors.push(newDoctor);

  //     fs.writeFile(filePath, JSON.stringify(doctors, null, 2), (err) => {
  //       if (err) {
  //         console.error("Failed to write file:", err);
  //         return res.status(500).json({ error: "Failed to save doctor" });
  //       }

  //       res.status(201).json(newDoctor);
  //     });
  //   });
  // });
  app.post("/api/doctors", async (req, res) => {
    try {
      const newDoctor = new Doctor(req.body);
      const savedDoctor = await newDoctor.save();
      res.status(201).json(savedDoctor);
    } catch (err) {
      console.error("Error saving doctor:", err);
      res.status(500).json({ error: "Failed to save doctor" });
    }
  });
  
