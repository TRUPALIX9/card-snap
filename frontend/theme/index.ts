import {
  MD3LightTheme as PaperLight,
  MD3DarkTheme as PaperDark,
  configureFonts,
  MD3Theme,
} from "react-native-paper";

import { Theme as NavigationTheme } from "@react-navigation/native";

const fontConfig = {
  fontFamily: "System", // Replace with your custom font name
};

const baseFonts = configureFonts({ config: fontConfig });

const fontStyle = (weight: any) => ({
  fontFamily: fontConfig.fontFamily,
  fontWeight: weight,
});

// Extend the fonts with required types
const extendedFonts = {
  ...baseFonts,
  regular: fontStyle("400"),
  medium: fontStyle("500"),
  bold: fontStyle("700"),
  heavy: fontStyle("900"),
};

export type CombinedTheme = MD3Theme &
  NavigationTheme & {
    fonts: typeof extendedFonts;
  };

export const lightTheme: CombinedTheme = {
  ...PaperLight,
  dark: false,
  fonts: extendedFonts,
  colors: {
    ...PaperLight.colors,
    primary: "#008BFF",
    background: "#ffffff",
    surface: "#f5f5f5",
    text: "#121212",
    onSurface: "#1c1c1c",
    outline: "#004C99", // 🔵 strong dark blue for visibility
    card: "#f5f5f5",
    border: "#ccc",
    notification: "#008BFF",
  },
};

export const darkTheme: CombinedTheme = {
  ...PaperDark,
  dark: true,
  fonts: extendedFonts,
  colors: {
    ...PaperDark.colors,
    primary: "#008BFF",
    background: "#000000",
    surface: "#1a1a1a",
    text: "#e0e0e0",
    onSurface: "#e0e0e0",
    outline: "#7CC4FF", // 🔵 light sky blue for contrast
    card: "#1a1a1a",
    border: "#444",
    notification: "#008BFF",
  },
};
