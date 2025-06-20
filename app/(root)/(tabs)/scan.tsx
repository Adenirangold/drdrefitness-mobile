// import { Overlay } from "@/components/CameraOverlay";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import Constants from "expo-constants";
// import { useRouter } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import React, { useState } from "react";
// import { ActivityIndicator, Button, Text, View } from "react-native";

// import { SafeAreaView } from "react-native-safe-area-context";

// export default function Scan() {
//   const [permission, requestPermission] = useCameraPermissions();

//   const [scanned, setScanned] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState({ status: "", message: "" });

//   const router = useRouter();

//   if (!permission) {
//     return (
//       <View className="flex-1 bg-blue-900">
//         <Text className="text-center pb-2.5 text-lg text-gray-800">
//           Camera permissions are loading...
//         </Text>
//       </View>
//     );
//   }

//   if (!permission.granted) {
//     return (
//       <SafeAreaView className="flex-1 bg-blue-900">
//         <Text className="text-center pb-2.5 text-lg text-gray-800">
//           We need your permission to use the camera
//         </Text>
//         <Button onPress={requestPermission} title="Grant Permission" />
//       </SafeAreaView>
//     );
//   }

//   const handleBarcodeScanned = async ({ data }: { data: any }) => {
//     if (scanned || loading) return;

//     setScanned(true);
//     setLoading(true);

//     try {
//       const parsedData = JSON.parse(data);
//       const { token, stationId } = parsedData;

//       const jwtToken = await SecureStore.getItemAsync("authToken");
//       if (!jwtToken) {
//         setResult({
//           status: "error",
//           message: "No authentication token found",
//         });
//         setLoading(false);
//         return;
//       }

//       const apiUrl = Constants.expoConfig?.extra?.API;
//       const response = await fetch(`${apiUrl}/checkinout/scan`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${jwtToken}`,
//         },
//         body: JSON.stringify({ token, stationId }),
//       });

//       const resultData = await response.json();
//       console.log("====================================");
//       console.log(resultData);
//       console.log("====================================");

//       if (response.ok && resultData.status === "success") {
//         setResult({
//           status: "success",
//           message:
//             resultData.action === "check-in"
//               ? "Access Granted"
//               : "Session ended successfully",
//         });

//         router.replace("/home");
//       } else {
//         setResult({
//           status: "error",
//           message:
//             resultData.message || `Access Denied (${resultData.message})`,
//         });
//         setScanned(false);
//       }
//     } catch (error) {
//       setResult({
//         status: "error",
//         message: "Network error, please try again",
//       });
//       setScanned(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTryAgain = () => {
//     setResult({ status: "", message: "" });
//     setScanned(false);
//   };

//   return (
//     <View className="flex-1 bg-blue-900">
//       <CameraView
//         className="flex-1 w-full h-full"
//         facing="back"
//         onCameraReady={() => console.log("Camera is ready")}
//         barcodeScannerSettings={{
//           barcodeTypes: ["qr"],
//         }}
//         onBarcodeScanned={handleBarcodeScanned}
//         onMountError={(error) => console.log("Camera mount error:", error)}
//       />
//       <Overlay></Overlay>
//       {loading && (
//         <View className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <ActivityIndicator size="large" color="#ffffff" />
//         </View>
//       )}
//     </View>
//   );
// }

import { Overlay } from "@/components/CameraOverlay";
import { CameraView, useCameraPermissions } from "expo-camera";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import _ from "lodash";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({ status: "", message: "" });
  const isScanningRef = useRef(false);
  const router = useRouter();

  // Debounced barcode scanning handler
  const handleBarcodeScanned = useCallback(
    _.debounce(async ({ data }: { data: any }) => {
      if (isScanningRef.current) {
        console.log("Scan ignored: already scanning");
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
          });
          setScanned(false);
          isScanningRef.current = false;
          return;
        }

        const jwtToken = await SecureStore.getItemAsync("authToken");
        if (!jwtToken) {
          setResult({
            status: "error",
            message: "No authentication token found",
          });
          setScanned(false);
          isScanningRef.current = false;
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
          });
          router.replace("/home");
        } else {
          setResult({
            status: "error",
            message: resultData.message || "Access Denied",
          });
          setScanned(false);
          isScanningRef.current = false;
        }
      } catch (error) {
        console.log("Error in handleBarcodeScanned:", error);
        setResult({
          status: "error",
          message: "Network error, please try again",
        });
        setScanned(false);
        isScanningRef.current = false;
      } finally {
        setLoading(false);
      }
    }, 1000), // Debounce for 1 second
    [] // Empty dependencies to prevent re-creating debounce function
  );

  // Handle retry button
  const handleTryAgain = useCallback(() => {
    setResult({ status: "", message: "" });
    setScanned(false);
    isScanningRef.current = false;
  }, []);

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
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
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
          onBarcodeScanned={handleBarcodeScanned}
          onMountError={(error) => console.log("Camera mount error:", error)}
        />
        <Overlay></Overlay>
        {loading && (
          <View className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}
      </>
    );
  }

  return <View className="flex-1 bg-blue-900">{content}</View>;
}
