// import { connectToDatabase } from "../../../../util/mongodb";
import { checkToken, addNewToken } from "../../../util/apiHelpers";
import _ from "lodash";

export default async (req, res) => {
  // Request body should have email and token
  if (req.method === "POST") {
    const response = await checkToken(req.body.token);
    console.log("RESPONSE:", response);
    if (_.isEmpty(response)) {
      res.status(401).json({
        error: "No active session for this user.",
        success: false,
      }); // Redirect to login in this case.
    } else {
      const newToken = addNewToken(req.body.email);
      res.status(200).json({
        message: "Session found.",
        success: true,
        newToken: newToken,
      }); // User is authorized to view page.
    }
  } else {
    res.status(400).json({
      error: "Something went wrong.",
      success: false,
    });
  }
};