// models/Organization.js
import mongoose from "mongoose";

const orgSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, match: /.+\@.+\..+/ },
    phone: { type: String, match: /^[0-9]{10}$/ },
    isActive: { type: Boolean, default: true },
    serviceRadiusKm: { type: Number, default: 10 },
    address: { type: String, trim: true },

    // 📍 GeoJSON location
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true, // [lng, lat]
        validate: {
          validator: function (val) {
            return val.length === 2;
          },
          message: "Coordinates must be [lng, lat]",
        },
      },
    },

    // 🔑 Admin (User reference)
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

orgSchema.index({ location: "2dsphere" });

export default mongoose.model("Organization", orgSchema);
