import {
  Canvas,
  DiffRect,
  Rect,
  rect,
  rrect,
} from "@shopify/react-native-skia";
import { useEffect } from "react";
import { Dimensions, Platform, StyleSheet } from "react-native";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const innerDimension = 300;

const outer = rrect(rect(0, 0, width, height), 0, 0);
const inner = rrect(
  rect(
    width / 2 - innerDimension / 2,
    height / 2 - innerDimension / 2,
    innerDimension,
    innerDimension
  ),
  50,
  50
);

export const Overlay = () => {
  // Animation setup for the scanning line
  const linePosition = useSharedValue(0);

  useEffect(() => {
    linePosition.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1, // Repeat indefinitely
      true // Reverse direction
    );
  }, []);

  const animatedInnerDimension = innerDimension - 78;

  // Compute the Y position of the line within the inner square
  const lineY = useDerivedValue(() => {
    const innerY = height / 2 - animatedInnerDimension / 2;
    return innerY + linePosition.value * animatedInnerDimension;
  });

  return (
    <Canvas
      style={
        Platform.OS === "android" ? { flex: 1 } : StyleSheet.absoluteFillObject
      }
    >
      {/* Semi-transparent background with transparent square */}
      <DiffRect inner={inner} outer={outer} color="black" opacity={0.8} />
      {/* Animated scanning line */}
      <Rect
        x={width / 2 - innerDimension / 2}
        y={lineY}
        width={innerDimension}
        height={5}
        color="red" // Laser-like red line
      />
    </Canvas>
  );
};
