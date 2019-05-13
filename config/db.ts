// External
import mongo from "mongodb";

// Constants
import * as Constants from "../utils/constants";

export default (async () => {
  const client = await mongo.connect(Constants.connectingString, {
    useNewUrlParser: true
  });
  let db = client.db();
  console.log("Connected to DB.");
  return db;
})();
