import express from "express";
import Guest from "../models/guest.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const guests = await Guest.find();
    res.json(guests);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const guest = await Guest.findOne({ email }).exec();
    if (!guest) {
      console.log("Guest not found:", email);
      return res.json([]);
    }
    res.json(guest);
  } catch (error) {
    console.error("Error fetching guest:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/", async (req, res) => {
  try {
    const { fullName, email } = req.body;

    const newGuest = new Guest({ fullName, email });

    const savedGuest = await newGuest.save();
    res.status(201).json(savedGuest);
  } catch (error) {
    console.error("Error saving guest:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:guestId", async (req, res) => {
  const { guestId } = req.params;
  const { nationality, countryFlag, nationalID } = req.body;

  try {
    if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
      throw new Error("Please provide a valid national ID");
    }

    const updateData = { nationality, countryFlag, nationalID };

    const updatedGuest = await Guest.findByIdAndUpdate(guestId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedGuest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    res.json(updatedGuest);
  } catch (error) {
    console.error("Error updating guest:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
