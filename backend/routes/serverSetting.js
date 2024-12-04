import express from "express";
import Setting from "../models/setting.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const settings = await Setting.findOne();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.patch("/", async (req, res) => {
  const updatedData = req.body;
  try {
    const settings = await Setting.findOneAndUpdate({}, updatedData, {
      new: true,
    });
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    res.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/", async (req, res) => {
  try {
    const {
      minBookingLength,
      maxBookingLength,
      maxGuestsPerBooking,
      breakfastPrice,
    } = req.body;
    const newSetting = new Setting({
      minBookingLength,
      maxBookingLength,
      maxGuestsPerBooking,
      breakfastPrice,
    });
    const savedSetting = await newSetting.save();
    res.status(201).json(savedSetting);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
