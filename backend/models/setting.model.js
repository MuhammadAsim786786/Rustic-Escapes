import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    minBookingLength: {
      type: Number,
      required: true,
      default: 5,
    },
    maxBookingLength: {
      type: Number,
      required: true,
      default: 90,
    },
    maxGuestsPerBooking: {
      type: Number,
      required: true,
      default: 15,
    },
    breakfastPrice: {
      type: Number,
      required: true,
      default: 15,
    },
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;
