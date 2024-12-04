import { redirect } from "next/navigation";

export async function createBooking(user, bookingData, formData) {
  try {
    const newBooking = {
      ...bookingData,
      guestId: user.guestId,
      numGuests: Number(formData.get("numGuests")),
      observations: formData.get("observations").slice(0, 1000),
      extrasPrice: 0,
      totalPrice: bookingData.cabinPrice,
      isPaid: false,
      hasBreakfast: false,
      status: "unconfirmed",
      created_at: new Date().toISOString(),
    };

    const response = await fetch("http://localhost:5001/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBooking),
    });

    if (!response.ok) {
      throw new Error(`Booking could not be created: ${response.statusText}`);
    }

    const data = await response.json();

    await fetch("http://localhost:3000/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: `/cabins/${bookingData.cabinId}` }),
    });

    redirect("/cabins/thankyou");

    return data;
  } catch (error) {
    console.error("Error creating booking:", error.message);
    throw error;
  }
}
