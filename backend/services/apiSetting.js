export async function getSettings() {
  const url = new URL("http://localhost:5001/api/settings");
  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Settings could not be retrieved");
  }
}
