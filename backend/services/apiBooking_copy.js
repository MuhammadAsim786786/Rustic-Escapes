"use server";
import { auth } from "../../app/_lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
export async function updateBooking(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const bookingId = formData.get("bookingId").trim();
  const numGuests = formData.get("numGuests");
  const observations = formData.get("observations");

  if (!/^\b\w+\b(?:\s+\b\w+\b){0,49}$/.test(observations)) {
    throw new Error("The text must not exceed 50 words.");
  }

  const updateData = { numGuests, observations };

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
    console.log("Booking updated:", data);

    revalidatePath(`/account/reservations/edit/${bookingId}`);
    revalidatePath("/account/reservations");
    redirect("/account/reservations");

    return data;
  } catch (error) {
    console.error("Error updating booking:", error.message);
    throw error;
  }
}
