import { CameraView, useCameraPermissions } from "expo-camera";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();

  // Debug permission state
  console.log("Permission:", permission);

  if (!permission) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-center pb-2.5 text-lg text-gray-800">
          Camera permissions are loading...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-center pb-2.5 text-lg text-gray-800">
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView className="flex-1" facing="back" />
    </View>
  );
}

const styles = StyleSheet.create({
  "flex-1": { flex: 1 },
  "bg-black": { backgroundColor: "#000000" },
  "justify-center": { justifyContent: "center" },
  "items-center": { alignItems: "center" },
  "bg-white": { backgroundColor: "#FFFFFF" },
  "text-center": { textAlign: "center" },
  "pb-2.5": { paddingBottom: 10 },
  "text-lg": { fontSize: 18 },
  "text-gray-800": { color: "#1F2937" },
});
