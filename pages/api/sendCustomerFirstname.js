import { connectToDatabase } from "../../util/mongodb";
const ObjectId = require("mongodb").ObjectID;

export default async function handler(req, res) {
  //TAKES THE EMAIL AND SEARCHES, NOT ID
  const { db } = await connectToDatabase();

  const data = req.query;
  const cust_email_str = data.email;
  const cust_email_param = cust_email_str;

  const cust_search_param = { email: cust_email_param };

  const new_firstname = data.firstname;
  const push_fname_cust = { $set: { first_name: new_firstname } };

  await db
    .collection("customers")
    .updateOne(cust_search_param, push_fname_cust);
}
