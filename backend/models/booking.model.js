import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  created_at: {
    type: Date,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  numGuests: {
    type: Number,
    required: true,
  },
  numNights: {
    type: Number,
    required: false,
  },
  extrasPrice: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    required: true,
  },
  cabinId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cabin",
    required: true,
  },
  hasBreakfast: {
    type: Boolean,
    required: true,
  },
  isPaid: {
    type: Boolean,
    required: true,
  },
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guest",
    required: true,
  },
  observations: {
    type: String,
    required: true,
  },
  cabinPrice: {
    type: Number,
    required: false,
  },
});

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;
