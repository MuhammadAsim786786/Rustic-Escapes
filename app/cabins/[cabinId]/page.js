import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { getCabins, getCabin } from "@/backend/services/apiCabin";
import { Suspense } from "react";

export async function generateMetadata({ params }) {
  const { name } = await getCabin(params.cabinId);
  return { title: `Cabin ${name}` };
}

export async function generateStaticParams() {
  const cabins = await getCabins();
  const ids = cabins.map((cabin) => ({ cabinId: String(cabin._id) }));
  return ids;
}

export default async function Page({ params }) {
  try {
    const cabin = await getCabin(params.cabinId);
    console.log("Cabin data fetched:", cabin);

    if (!cabin) {
      return (
        <div className="max-w-6xl ms-auto mtt-8">
          <p className="text-center text-red-500">Cabin not found</p>
        </div>
      );
    }

    return (
      <div className="max-w-6xl ms-auto mtt-8">
        <Cabin cabin={cabin} />
        <div>
          <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
            Reserve {cabin.name} today. Pay on arrival.
          </h2>
          <Suspense fallback={<Spinner />}>
            <Reservation cabin={cabin} />
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering cabin:", error);
    return (
      <div className="max-w-6xl ms-auto mtt-8">
        <p className="text-center text-red-500">Error loading cabin</p>
      </div>
    );
  }
}
