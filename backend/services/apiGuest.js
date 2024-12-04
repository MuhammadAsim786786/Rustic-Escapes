export async function getGuest(email) {
  try {
    const response = await fetch(`http://localhost:5001/api/guests/${email}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Guest. Status: ${response.status}`);
    }
    const data = await response.json();
    if (!data || Object.keys(data).length === 0) {
      console.error("Guest not found:", email);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error in getGuest:", error.message);
    throw error;
  }
}

export async function createGuest(newGuest) {
  try {
    const response = await fetch("http://localhost:5001/api/guests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newGuest),
    });

    if (!response.ok) {
      throw new Error(`Guest creation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in createGuest:", error.message);
    throw error;
  }
}
