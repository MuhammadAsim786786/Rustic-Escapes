import Booking from "../models/booking.model.js";
export async function getBookings({
  filterField,
  filterValue,
  sortField,
  sortDirection,
  page,
  pageSize,
}) {
  try {
    let query = Booking.find();

    if (filterField && filterValue) {
      query = query.where(filterField).equals(filterValue);
    }

    if (sortField && sortDirection) {
      const sortOrder = sortDirection === "asc" ? 1 : -1;
      query = query.sort({ [sortField]: sortOrder });
    }

    const skip = (page - 1) * pageSize;
    query = query.skip(skip).limit(Number(pageSize));

    query = query
      .populate("guestId", "fullName email")
      .populate("cabinId", "name");

    const bookings = await query;
    const count = await Booking.countDocuments(query.getFilter());

    const transformedBookings = bookings.map((booking) => ({
      bookingId: booking._id,
      created_at: booking.created_at,
      startDate: booking.startDate,
      endDate: booking.endDate,
      numGuests: booking.numGuests,
      cabinPrice: booking.cabinPrice,
      totalPrice: booking.totalPrice,
      status: booking.status,
      guestName: booking.guestId?.fullName || booking.guestId?.email,
      email: booking.guestId?.email,
      cabinName: booking.cabinId?.name,
      observations: booking.observations,
      isPaid: booking.isPaid,
      hasBreakfast: booking.hasBreakfast,
      numNights: booking.numNights,
    }));

    return { data: transformedBookings, count };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw new Error("Bookings could not be loaded");
  }
}

export async function getBooking(id) {
  console.log("Fetching booking for ID:", id.trim());
  try {
    const response = await fetch(
      `http://localhost:5001/api/bookings/${id.trim()}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      console.log("Booking not found or server error.");
      return null;
    }

    const data = await response.json();
    if (!data) {
      console.log("No booking found with the given ID.");
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching booking:", error.message);
    throw error;
  }
}
export async function getBookingMain(id) {
  try {
    const response = await fetch(
      `http://localhost:5001/api/bookings/main/${id.trim()}`,
      {
        method: "GET",
        headers: { "Cache-Control": "no-store" },
      }
    );

    if (!response.ok) {
      console.log("Booking not found or server error.");
      return null;
    }

    const data = await response.json();
    if (!data) {
      console.log("No booking found with the given ID.");
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching booking:", error.message);
    throw error;
  }
}

export async function deleteReservation(id) {
  try {
    const response = await fetch(`http://localhost:5001/api/bookings/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Booking could not be deleted", error);
    throw error;
  }
}
export async function getBookedDatesByCabinId(cabinId) {
  try {
    const response = await fetch(
      `http://localhost:5001/api/bookings/getBookedDatesByCabinId/${cabinId}`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch booking dates by cabinId: ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error", error.message);
    throw error;
  }
}
export async function updateBooking(bookingId, updateData) {
  try {
    const response = await fetch(
      `http://localhost:5001/api/bookings/${bookingId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      throw new Error(`Booking could not be updated: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating booking:", error.message);
    throw error;
  }
}
