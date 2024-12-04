"use client";
import { useState, useEffect } from "react";
import ReservationCard from "./ReservationCard";
import { deleteReservation } from "../_lib/actions";

function ReservationList({ bookings }) {
  const [currentBookings, setCurrentBookings] = useState(bookings || []);

  useEffect(() => {
    if (Array.isArray(bookings)) {
      setCurrentBookings(bookings);
    }
  }, [bookings]);

  async function handleDelete(bookingId) {
    try {
      await deleteReservation(bookingId);
      setCurrentBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );
    } catch (error) {
      console.error("Failed to delete reservation:", error);
    }
  }
  console.log(bookings);
  let val = Array.isArray(currentBookings);
  console.log(val);

  return (
    <ul className="space-y-6">
      {Array.isArray(currentBookings) &&
        currentBookings.map((booking) => (
          <ReservationCard
            onDelete={handleDelete}
            booking={booking}
            key={booking._id}
          />
        ))}
    </ul>
  );
}

export default ReservationList;
