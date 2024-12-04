"use server";
import { auth } from "../../app/_lib/auth.js";
import { revalidatePath } from "next/cache.js";
import { redirect } from "next/navigation.js";
export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updateData = { nationality, countryFlag, nationalID };

  try {
    const response = await fetch(
      `http://localhost:5001/api/guests/${session.user.guestId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      throw new Error(`Guest could not be updated: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Guest updated:", data);

    revalidatePath("/account/profile");
    redirect("/account");

    return data;
  } catch (error) {
    console.error("Error updating guest:", error.message);
    throw error;
  }
}
