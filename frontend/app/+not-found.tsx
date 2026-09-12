"use client";
import { Stack, useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

export default function NotFoundScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text style={[styles.emoji, { color: theme.colors.error }]}>🚫</Text>

        <Text style={[styles.title, { color: theme.colors.error }]}>
          404 – Page Not Found
        </Text>

        <Text
          style={[
            styles.description,
            { color: theme.colors.onSurface, opacity: 0.7 },
          ]}
        >
          This screen doesn’t exist. Please check the route or return home.
        </Text>

        <View style={styles.buttonGroup}>
          <Button
            mode="contained"
            onPress={() => router.replace("/")}
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            labelStyle={styles.buttonLabel}
          >
            🔄 Reset and Go Home
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.push("/")}
            textColor={theme.colors.primary}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            🏠 Back to Home
          </Button>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
  },
  buttonGroup: {
    width: "100%",
    gap: 12,
  },
  button: {
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
});
