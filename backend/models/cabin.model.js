import mongoose from "mongoose";

const cabinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  maxCapacity: {
    type: Number,
    required: true,
  },
  regularPrice: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Cabin = mongoose.models.Cabin || mongoose.model("Cabin", cabinSchema);

export default Cabin;
