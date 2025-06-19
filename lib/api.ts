import Constants from "expo-constants";
const apiUrl = Constants.expoConfig?.extra?.API;

export const getUser = async (token: string) => {
  let error;
  try {
    const response = await fetch(`${apiUrl}/members`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      error = errorData.message || "An unknown error occurred";
      return;
    }

    const data = await response.json();
    return { data, error };
  } catch (error: any) {
    console.error("Error fetching user data:", error);
    error = error.message || "An unknown error occurred";
    return { data: null, error };
  }
};
