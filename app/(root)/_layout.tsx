import { useAuth } from "@/context/authContext";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator } from "react-native";
import "../globals.css";

export default function Layout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading)
    return (
      <ActivityIndicator size={"large"} color="#0000ff"></ActivityIndicator>
    );

  if (!isAuthenticated) return <Redirect href="/login" />;

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
