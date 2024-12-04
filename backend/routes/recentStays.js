import express from "express";
import Booking from "../models/booking.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { afterDate } = req.query;

    if (!afterDate) {
      return res
        .status(400)
        .json({ message: "Missing required 'afterDate' parameter" });
    }

    const parsedDate = new Date(afterDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const today = new Date();
    const stays = await Booking.find()
      .where("startDate")
      .gte(parsedDate)
      .lte(today)
      .populate("guestId", "fullName email")
      .populate("cabinId", "name");

    res.json(stays);
  } catch (error) {
    console.error("Error fetching stays:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
