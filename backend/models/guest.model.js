import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: false,
  },
  nationalID: {
    type: String,
    required: false,
  },
  countryFlag: {
    type: String,
    required: false,
  },
});

const Guest = mongoose.models.Guest || mongoose.model("Guest", guestSchema);
export default Guest;
