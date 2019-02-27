// External
import mongoose, { Schema } from "mongoose";
// Contracts
import { IUser } from "../utils/contracts";

const userSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  username: {
    type: String,
    required: true,
    match: /^(?=.*[a-zA-Z])(?=.{5,})/
  },
  password: {
    type: String,
    required: true,
    match: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{8,})/
  },
  advertisements: [{ type: Schema.Types.ObjectId, ref: "Advertisement" }]
});

export default mongoose.model<IUser & mongoose.Document>("User", userSchema);
