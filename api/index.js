import { MongoClient, ObjectId } from 'mongodb';
import { uri, dev } from './credentials.js';
import express from "express";
import cors from "cors";
import "dotenv/config";


const PORT = 3030
const app = express();
app.use(cors());
app.use(express.json());
 
//connects to DB 'shelly'
// const client = new MongoClient(uri); // ONLINE
const client = new MongoClient(dev); //OFFLINE

const db = client.db('shelly');
//----------------------------------------------------------

//retrieves collection item from DB 
const shellyCollection = db.collection('shelly');


//retrieves one line from DB
// export async function getAllFurniture(req, res) {
//     const collection = await db.collection("startup-log").find().toArray()
//     res.send(collection)
//   }

// ADD ONE
// const chair = {
//     name: 'Ergo Chair',
//     brand: 'Autonomous',
//     color: 'Grey',
//     price: 369.00,
//     warranty: '2 years',
// }
  
// async function addOneItem(startup_log) {
//     const res = await db.collection("startup_log").insertOne(startup_log);
//     console.log(res);
// }
// addOneItem(chair);

app.listen(PORT, () => console.log(`api running on port ${PORT}`));