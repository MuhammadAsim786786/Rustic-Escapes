import express from "express";
import Cabin from "../models/cabin.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cabins = await Cabin.find();
    res.json(cabins);
  } catch (error) {
    console.error("Error loading cabins:", error.message);
    res.status(500).json({ message: "Cabins could not be loaded" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cabin = await Cabin.findById(id);
    if (!cabin) {
      return res.status(404).json({ message: "Cabin not found" });
    }
    res.json(cabin);
  } catch (error) {
    console.error("Error loading cabin:", error.message);
    res.status(500).json({ message: "Cabin could not be loaded" });
  }
});

export default router;
