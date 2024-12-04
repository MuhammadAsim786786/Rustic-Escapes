import express from "express";
import Booking from "../models/booking.model.js";
import { getBookings } from "../services/apiBooking.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const {
      filterField,
      filterValue,
      sortField,
      sortDirection,
      page = 1,
      pageSize = 5,
    } = req.query;

    const bookingsData = await getBookings({
      filterField,
      filterValue,
      sortField,
      sortDirection,
      page,
      pageSize,
    });

    res.json(bookingsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/main/:id", async (req, res) => {
  try {
    const bookingId = req.params.id.trim();

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.get("/:guestId", async (req, res) => {
  try {
    const guestId = req.params.guestId.trim(); 

    const bookings = await Booking.find({ guestId }).populate("cabinId"); 

    if (!bookings || bookings.length === 0) {
      console.log("No bookings found for the given guest ID.");
      return res
        .status(404)
        .json({ message: "No bookings found for the given guest ID" });
    }

    res.json(bookings); 
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      created_at,
      startDate,
      endDate,
      cabinId,
      guestId,
      hasBreakfast,
      isPaid,
      numGuests,
      observations,
      cabinPrice,
      status,
    } = req.body;

    const numNights = Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    );

    const extrasPrice = 0; 
    const totalPrice = cabinPrice * numNights + extrasPrice;

    const newBooking = new Booking({
      created_at,
      startDate,
      endDate,
      numGuests,
      cabinId,
      guestId,
      hasBreakfast,
      isPaid,
      observations,
      cabinPrice,
      status,
      numNights,
      extrasPrice,
      totalPrice,
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/checkin/:id", async (req, res) => {
  const { id } = req.params;
  const { isPaid, hasBreakfast, extrasPrice } = req.body;
  console.log(extrasPrice);

  try {
    const sanitizedId = id.trim();
    const updatedBooking = await Booking.findByIdAndUpdate(
      sanitizedId,
      {
        status: "checked-in",
        isPaid,
        hasBreakfast,
        extrasPrice,
      },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/checkout/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const sanitizedId = id.trim();
    const updatedBooking = await Booking.findByIdAndUpdate(
      sanitizedId,
      {
        status: "checked-out",
      },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:bookingId", async (req, res) => {
  let { bookingId } = req.params;
  bookingId = bookingId.trim();

  const { numGuests, observations } = req.body;

  try {
    if (!/^\b\w+\b(?:\s+\b\w+\b){0,49}$/.test(observations)) {
      throw new Error("The text must not exceed 50 words.");
    }

    const updateData = { numGuests, observations };

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id.trim());
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
