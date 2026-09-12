import { useEffect, useContext } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Provider as PaperProvider } from "react-native-paper";
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import { ThemeProvider, ThemeContext } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/theme";
import { View } from "react-native";
import Header from "../components/Header";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
function RootLayoutNav() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const paperTheme = isDark ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationThemeProvider value={paperTheme}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <View style={{ flex: 1 }}>
          <Header />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            {/* <Stack.Screen name="modal" options={{ presentation: "modal" }} /> */}
          </Stack>
        </View>
      </NavigationThemeProvider>
    </PaperProvider>
  );
}
