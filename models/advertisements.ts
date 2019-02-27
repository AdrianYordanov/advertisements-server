// External
import mongoose, { Schema } from "mongoose";
// Contracts
import { IAdvertisement } from "../utils/contracts";

const advertisementSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true, match: /.{5,}/ },
  price: {
    type: Number,
    required: true,
    min: [0, "Price should be positive."]
  },
  description: { type: String, required: true, match: /.{10,}/ },
  imagePath: { type: String, required: true },
  image: { type: String, required: true },
  owner: { type: String },
  creatorId: { type: Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model<IAdvertisement & mongoose.Document>(
  "Advertisement",
  advertisementSchema
);
