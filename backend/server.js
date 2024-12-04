import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cabinRoutes from "./routes/serverCabin.js";
import guestRoutes from "./routes/serverGuest.js";
import bookingRoutes from "./routes/serverBooking.js";
import settingRoutes from "./routes/serverSetting.js";
import recentBookingsRoutes from "./routes/recentBooking.js";
import recentStaysRoutes from "./routes/recentStays.js";
import todayActivityRoutes from "./routes/toadayActivity.js";
import getBookedDatesByCabinIdRoutes from "./routes/getBookedDatesByCabinIdRoutes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Server is ready");
});

// Mount routes
app.use("/api/cabins", cabinRoutes);
app.use("/api/guests", guestRoutes);
app.use("api/guests", guestRoutes);
app.use("/api/bookings/recent", recentBookingsRoutes);
app.use("/api/bookings/stays", recentStaysRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/bookings/today-activity", todayActivityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/bookings/getBookedDatesByCabinId", getBookedDatesByCabinIdRoutes);

app.listen(5001, () => {
  console.log("Server started at port 5001");
});
