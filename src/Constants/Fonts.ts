import { Dimensions, Platform, PixelRatio } from "react-native";
export const Fonts = {
  AfacadBold: "Afacad-Bold",
  AfacadMedium: "Afacad-Medium",
  AfacadRegular: "Afacad-Regular",
  AfacadSemibold: "Afacad-SemiBold",
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const scale = SCREEN_WIDTH / 320;

export function fontSize(size: number) {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}
