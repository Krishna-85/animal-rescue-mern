import mongoose from "mongoose";
const ReportSchema = new mongoose.Schema(
  {
    description: String,
    images: [String],
    status: {
      type: String,
      enum: ["pending", "assigned", "en_route", "completed", "cancelled"],
      default: "pending"
    },
    reporter: { name: String, phone: String },
    address: String,
    location: {
      type: { type: String, enum: ["Point"], default: "Point", required: true },
      coordinates: { type: [Number], required: true } // [lng, lat]
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null
    }
  },
  { timestamps: true }
);
ReportSchema.index({ location: "2dsphere" });
export default mongoose.model("Report", ReportSchema);
