import { useAuth } from "@/context/authContext";
import { Link } from "expo-router";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text>welcome to money</Text>
      <Link href="/login">Login</Link>
    </SafeAreaView>
  );
}

// import React from "react";
// import { Text, View } from "react-native";

// export default function App() {
//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text>Test App</Text>
//     </View>
//   );
// }
