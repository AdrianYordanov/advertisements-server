// External
import mongoose from "mongoose";

// Constants
import * as Constants from "../utils/constants";

export default () => {
  mongoose.connect(Constants.connectingString, { useNewUrlParser: true });
  mongoose.connection
    .once("open", err => {
      if (err) {
        throw err;
      }

      console.log("Database connected...");
    })
    .on("error", reason => {
      console.log(reason);
    });
};
