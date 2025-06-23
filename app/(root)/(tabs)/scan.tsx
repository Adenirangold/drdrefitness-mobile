import { Overlay } from "@/components/CameraOverlay";
import { CameraView, useCameraPermissions } from "expo-camera";
import Constants from "expo-constants";
import { useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Button, Modal, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [result, setResult] = useState({ status: "", message: "", action: "" });
  const isScanningRef = useRef(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setScanned(false);
      setLoading(false);
      setModalVisible(false);
      setResult({ status: "", message: "", action: "" });
      isScanningRef.current = false;
    }, [])
  );

  // Handle barcode scanning
  const handleBarcodeScanned = async ({ data }: { data: any }) => {
    if (isScanningRef.current || scanned) {
      console.log("Scan ignored: already scanned");
      return;
    }
    isScanningRef.current = true;
    setScanned(true);
    setLoading(true);

    try {
      const parsedData = JSON.parse(data);
      const { token, stationId } = parsedData;

      if (!token || !stationId) {
        setResult({
          status: "error",
          message: "Invalid QR code data",
          action: "",
        });
        setModalVisible(true);
        return;
      }

      const jwtToken = await SecureStore.getItemAsync("authToken");
      if (!jwtToken) {
        setResult({
          status: "error",
          message: "No authentication token found",
          action: "",
        });
        setModalVisible(true);
        return;
      }

      const apiUrl = Constants.expoConfig?.extra?.API;
      const response = await fetch(`${apiUrl}/checkinout/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ token, stationId }),
      });

      const resultData = await response.json();
      console.log("API response:", resultData);

      if (response.ok && resultData.status === "success") {
        setResult({
          status: "success",
          message:
            resultData.action === "check-in"
              ? "Access Granted"
              : "Session ended successfully",
          action: resultData.action,
        });
      } else {
        setResult({
          status: "error",
          message: resultData.message || "Access Denied",
          action: "",
        });
      }
      setModalVisible(true);
    } catch (error) {
      console.log("Error in handleBarcodeScanned:", error);
      setResult({
        status: "error",
        message: "Network error, please try again",
        action: "",
      });
      setModalVisible(true);
    } finally {
      setLoading(false);
      isScanningRef.current = false;
    }
  };

  // Handle modal button press
  const handleModalButton = () => {
    ``;
    setModalVisible(false);
    if (result.status === "success") {
      router.replace("/home");
    } else {
      setScanned(false);
      setResult({ status: "", message: "", action: "" });
    }
  };

  // Conditional content based on permission state
  let content;
  if (!permission) {
    content = (
      <SafeAreaView className="flex-1 bg-blue-900 justify-center items-center">
        <Text className="text-center pb-2.5 text-lg text-gray-800">
          Camera permissions are loading...
        </Text>
      </SafeAreaView>
    );
  } else if (!permission.granted) {
    content = (
      <SafeAreaView className="flex-1 bg-blue-900 justify-center items-center">
        <Text className="text-center pb-2.5 text-lg text-gray-800">
          {permission.canAskAgain
            ? "We need your permission to use the camera"
            : "Camera permission was denied. Please enable it in your device settings."}
        </Text>
        {permission.canAskAgain && (
          <Button onPress={requestPermission} title="Grant Permission" />
        )}
      </SafeAreaView>
    );
  } else {
    content = (
      <>
        <CameraView
          style={{ flex: 1, width: "100%", height: "100%" }}
          facing="back"
          onCameraReady={() => console.log("Camera is ready")}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          onMountError={(error) => console.log("Camera mount error:", error)}
        />
        <Overlay />
        {loading && (
          <View className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
            <View className="bg-white p-5 rounded-lg w-4/5">
              <Text className="text-center text-lg font-bold mb-4">
                {result.message}
              </Text>
              <Button
                title={result.status === "success" ? "Go to Home" : "Try Again"}
                onPress={handleModalButton}
              />
            </View>
          </View>
        </Modal>
      </>
    );
  }

  return <View className="flex-1 bg-blue-900">{content}</View>;
}
