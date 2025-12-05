import {
  Blur,
  Canvas,
  DiffRect,
  LinearGradient,
  Rect,
  rect,
  rrect,
  vec,
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
    innerDimension
    innerDimension
    innerDimension
    innerDimension
    innerDimension
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
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
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

  // Determine trail direction based on line movement
  const isMovingDown = useDerivedValue(() => {
    return linePosition.value > 0.5 ? 1 : -1;
  });

  // Compute gradient start and end points for the comet trail
  const gradientStart = useDerivedValue(() =>
    vec(width / 2 - innerDimension / 2, lineY.value)
  );
  const gradientEnd = useDerivedValue(() =>
    vec(width / 2 - innerDimension / 2, lineY.value - isMovingDown.value * 80)
  );

  // Slightly offset the glow to align with the main line
  const glowY = useDerivedValue(() => lineY.value - 10);

  return (
    <Canvas
      style={
        Platform.OS === "android" ? { flex: 1 } : StyleSheet.absoluteFillObject
      }
    >
      {/* Semi-transparent background with transparent square */}
      <DiffRect inner={inner} outer={outer} color="black" opacity={0.9} />
      {/* Glow effect behind the main line */}
      <Rect
        x={width / 2 - innerDimension / 2}
        y={glowY}
        width={innerDimension}
        height={25}
        color="rgba(255, 50, 50, 0.5)"
      >
        <Blur blur={10} />
        <LinearGradient
          start={gradientStart}
          end={gradientEnd}
          colors={["rgba(255, 50, 50, 0.5)", "rgba(255, 50, 50, 0)"]}
        />
      </Rect>
      {/* Main animated scanning line with comet trail */}
      <Rect
        x={width / 2 - innerDimension / 2}
        y={lineY}
        width={innerDimension}
        height={5}
        color="red"
      >
        <LinearGradient
          start={gradientStart}
          end={gradientEnd}
          colors={["red", "rgba(255, 0, 0, 0)"]}
        />
      </Rect>
    </Canvas>
  );
};
