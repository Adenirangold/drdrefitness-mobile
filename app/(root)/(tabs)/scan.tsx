import { Overlay } from "@/components/CameraOverlay";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permissions are loading...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </SafeAreaView>
    );
  }

  const handleBarcodeScanned = async ({ data }: { data: any }) => {
    if (scanned || loading) return;

    setScanned(true);
    setLoading(true);

    try {
      const parsedData = JSON.parse(data);
      const { token, stationId } = parsedData;

      const jwtToken = await SecureStore.getItemAsync("authToken");
      if (!jwtToken) {
        // setResult({ status: "error", message: "No authentication token found" });
        setLoading(false);
        return;
      }

      const response = await fetch("https://your-api-url/api/checkinout/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ token, stationId }),
      });

      const resultData = await response.json();
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onCameraReady={() => console.log("Camera is ready")}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={handleBarcodeScanned}
        onMountError={(error) => console.log("Camera mount error:", error)}
      />
      <Overlay></Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e3a8a", // Matches bg-blue-950
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  text: {
    textAlign: "center",
    paddingBottom: 10,
    fontSize: 18,
    color: "#1f2937", // Matches text-gray-800
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "#1e3a8a",
  },
});
