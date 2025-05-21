import { useAuth } from "@/context/authContext";
import { Redirect, Stack } from "expo-router";
import "../globals.css";

export default function Layout() {
  const { isAuthenticated, loading } = useAuth();

  if (!loading && !isAuthenticated) return <Redirect href="/login" />;

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
