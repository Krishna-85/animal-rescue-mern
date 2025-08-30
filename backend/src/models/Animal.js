import mongoose from "mongoose";

const animalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true }, // e.g., Dog, Cat, Cow
  age: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["healthy", "injured", "rescued", "adopted"], 
    default: "rescued" 
  },
  description: { type: String },
  location: { type: String },
  image: { type: String },
}, { timestamps: true });

const Animal = mongoose.model("Animal", animalSchema);
export default Animal;
