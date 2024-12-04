import { revalidatePath } from "next/cache";

export async function POST(req) {
  try {
    const { path } = await req.json();

    if (!path) {
      return new Response("Path is required", { status: 400 });
    }

    revalidatePath(path);
    return new Response("Revalidation triggered successfully");
  } catch (error) {
    console.error("Revalidation error:", error);
    return new Response("Failed to revalidate path", { status: 500 });
  }
}
