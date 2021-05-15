import { connectToDatabase } from "../../util/mongodb";

const ObjectId = require('mongodb').ObjectID;

export default async function handler(req, res) {
    const { db } = await connectToDatabase();



    const response = await db.collection("vendors").find().sort({business_name: 1}).limit(20).toArray();
    // no array for testing purposes for now
    //console.log(response);

    res.json(response);

    //
    //return response;
}