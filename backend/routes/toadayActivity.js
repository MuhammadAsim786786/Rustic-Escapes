import express from "express";
import Booking from "../models/booking.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("guestId", "fullName nationality countryFlag")
      .populate("cabinId", "name");

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
