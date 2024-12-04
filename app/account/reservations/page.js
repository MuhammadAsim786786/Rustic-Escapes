import ReservationList from "@/app/_components/ReservationList";
import { auth } from "@/app/_lib/auth";
import { getBooking } from "@/backend/services/apiBooking";

export const metadata = {
  title: "Reservations",
};

export default async function Page() {
  const session = await auth();
  let bookings = [];
  try {
    bookings = (await getBooking(session.user.guestId)) || [];
    console.log("Bookings fetched:", bookings);
  } catch (error) {
    console.error("Failed to fetch bookings:", error.message);
  }

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Your reservations
      </h2>

      {bookings && bookings.length === 0 ? (
        <p className="text-lg">
          You have no reservations yet. Check out our{" "}
          <a className="underline text-accent-500" href="/cabins">
            luxury cabins &rarr;
          </a>
        </p>
      ) : (
        <ReservationList bookings={bookings} />
      )}
    </div>
  );
}
