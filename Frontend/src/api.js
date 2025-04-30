const API_URL = "http://localhost:5000";  // Backend URL

export const getServerMessage = async () => {
  try {
    const response = await fetch(`${API_URL}/`);
    const data = await response.json();  // Changed to json() since our backend sends JSON
    return data;
  } catch (error) {
    console.error("Error fetching server data:", error);
    throw error;  // Re-throw the error so we can handle it in the component
  }
};
