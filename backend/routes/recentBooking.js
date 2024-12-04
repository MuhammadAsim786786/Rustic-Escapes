import express from "express";
import Booking from "../models/booking.model.js";
import { getToday } from "../../utils/helpers.js";

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const { afterDate } = req.query;

    const parsedDate = new Date(afterDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    let query = Booking.find();

    if (afterDate) {
      query = query
        .where("startDate")
        .gte(parsedDate)
        .lte(getToday({ end: true }));
    }

    const bookings = await query
      .populate("guestId", "fullName email")
      .populate("cabinId", "name");

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching recent bookings:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
