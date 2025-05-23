import React from "react";
import { SafeAreaView, Text } from "react-native";

export default function App() {
  // const [permission, requestPermission] = useCameraPermissions();

  // // Handle permission states
  // if (!permission) {
  //   return (
  //     <View className="flex-1 justify-center items-center">
  //       <Text className="text-center pb-2.5 text-lg text-gray-800">
  //         Camera permissions are still loading...
  //       </Text>
  //     </View>
  //   );
  // }

  // if (!permission.granted) {
  //   return (
  //     <View className="flex-1 justify-center items-center">
  //       <Text className="text-center pb-2.5 text-lg text-gray-800">
  //         We need your permission to show the camera
  //       </Text>
  //       <Button onPress={requestPermission} title="Grant Permission" />
  //     </View>
  //   );
  // }

  return (
    // <CameraView
    //   className="flex-1"
    //   facing="back"
    //   barcodeScannerSettings={{
    //     barcodeTypes: ["qr"],
    //   }}
    // />

    <SafeAreaView>
      <Text className="text-center pb-2.5 text-lg text-gray-800">hools</Text>
    </SafeAreaView>
  );
}
