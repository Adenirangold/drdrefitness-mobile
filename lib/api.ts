export const getUser = async (token: string) => {
  let error;
  try {
    const response = await fetch(`http://172.20.10.3:3000/api/members`, {
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
