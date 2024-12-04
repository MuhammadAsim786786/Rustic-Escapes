import express from "express";
import Booking from "../models/booking.model.js";
import { eachDayOfInterval } from "date-fns";

const router = express.Router();

router.get("/:cabinId", async (req, res) => {
  const { cabinId } = req.params;
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  try {
    const bookings = await Booking.find({
      cabinId: cabinId,
      $or: [{ startDate: { $gte: today } }, { status: "checked-in" }],
    });

    if (!bookings) {
      return res.status(404).json({ message: "Bookings could not get loaded" });
    }

    const bookedDates = bookings
      .map((booking) => {
        return eachDayOfInterval({
          start: new Date(booking.startDate),
          end: new Date(booking.endDate),
        });
      })
      .flat();

    res.json(bookedDates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Bookings could not get loaded" });
  }
});

export default router;
