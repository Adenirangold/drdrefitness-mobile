import { AuthProvider } from "@/context/authContext";
import { SplashScreen, Stack } from "expo-router";
import "./globals.css";

export default function RootLayout() {
  SplashScreen.preventAutoHideAsync();
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="(root)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
