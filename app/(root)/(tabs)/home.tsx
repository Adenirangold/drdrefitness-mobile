import { useAuth } from "@/context/authContext";
import { Link } from "expo-router";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function home() {
  const { signOut } = useAuth();
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text>welcome</Text>
      <Link href="/login">Login</Link>
      <Button onPress={() => signOut()} title="log-out"></Button>
    </SafeAreaView>
  );
}
