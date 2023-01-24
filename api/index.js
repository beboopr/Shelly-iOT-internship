import { MongoClient, ObjectId } from 'mongodb';


import { uri } from './credentials.js';

const client = new MongoClient(uri);


//connects to DB 'shelly'
const db = client.db('shelly');

//retrieves collection shellyProject from DB called shelly
const shellyCollection = db.collection('item');


//retrieves one line from DB
const shelly = await shellyCollection.findOne({});
console.log(shelly);

//retrieves collection movies from DB called shelly

// const shellyCollection = db.collection('item');


// const query = {
//    item: "iPhone14ProMax"
// }


// //retrieves results from DB

// const shelly = await shellyCollection.findOne(query);
// console.log(shelly);

//add new movie
// const newShelly = {
//     item: "iPhone10X",
// }
 
// const result = await moviesCollection.insertOne(newShelly);
// console.log("Result of insert", result);