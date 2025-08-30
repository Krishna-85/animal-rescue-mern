// backend/models/RescueRequest.js
import mongoose from "mongoose";

const rescueRequestSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true, // har request me image hona hi chahiye
    },
    description: {
      type: String,
      default: "",
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "completed"],
      default: "pending",
    },
    nearbyGaushala: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gaushala", // maan lo tumhara gaushala ka model hai
    },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const RescueRequest = mongoose.model("RescueRequest", rescueRequestSchema);

export default RescueRequest;
