import { MongoClient, ObjectId } from 'mongodb';
import { uri, dev } from './credentials.js';
import express from "express";
import cors from "cors";
import "dotenv/config";

const PORT = 3030
const app = express();
app.use(cors());
app.use(express.json());

// connects to DB 'shelly'
const client = new MongoClient(uri); // ONLINE
// const client = new MongoClient(dev); //OFFLINE

const db = client.db('shelly');
// ----------------------------------------------------------

// retrieves collection item from DB
const shellyCollection = db.collection('shelly');

// retrieves one line from DB
// export async function getAll(req, res) {
//     const res = await db.collection("startup-log").find().toArray()
//     res.send(res)
//   }

// ADD ONE
// const item = {
//     name: 'Ergo Chair',
//     brand: 'Autonomous',
//     color: 'Blue',
//     price: 500.00,
//     warranty: '2 years',
// }

// async function addOneItem(startup_log) {
//     const res = await db.collection("startup_log").insertOne(startup_log);
//     console.log(res);
// }
// addOneItem(item);

app.listen(PORT, () => console.log(`api running on port ${PORT} Captain...`));

// import fetch from "node-fetch";
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import {
//   addNewDevice,
//   getAllDevices,
//   getDeviceData,
//   toggleSwitch,
// } from "./devices.js";

// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(cors());

// const PORT = 3030;
// app.listen(PORT, () =>
//   console.log(`Listening on http://localhost:${PORT} Captain ED...`)
// );

// app.post("/devices", addNewDevice);
// app.get("/devices", getAllDevices);
// app.get("/fetch", async (req, res) => {
//   toggleSwitch();
//   const result = await getDeviceData();
//   const data = await result.json();
//   res.send(data);
// });
