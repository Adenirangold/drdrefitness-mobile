import { Overlay } from "@/components/CameraOverlay";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useState } from "react";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Debug permission state
  // console.log("Permission:", permission);

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

  const handleBarcodeScanned = ({ data }: { data: any }) => {
    if (!scanned) {
      setScanned(true);

      console.log(`QR Code scanned: , Data=${data}`);
      // Allow re-scanning after a delay
      setTimeout(() => setScanned(false), 3000);
    }
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
