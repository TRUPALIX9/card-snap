"use client";

import { useRouter } from "expo-router";
import { View, StyleSheet, Image } from "react-native";
import { Text, Button, useTheme, Surface, Divider } from "react-native-paper";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme(); // ✅ Uses current active theme (light or dark)

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Surface
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        elevation={4}
      >
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.logo}
        />

        <Text
          variant="headlineMedium"
          style={[styles.heading, { color: theme.colors.primary }]}
        >
          Welcome to Card Vault
        </Text>

        <Text
          variant="bodyMedium"
          style={[styles.subheading, { color: theme.colors.onSurface }]}
        >
          Your all-in-one business card manager. Scan, store, and manage
          contacts seamlessly.
        </Text>

        <Divider
          style={{ marginBottom: 24, backgroundColor: theme.colors.outline }}
        />

        <Button
          mode="contained"
          onPress={() => router.push("/(tabs)/contacts")}
          style={[
            styles.primaryButton,
            { backgroundColor: theme.colors.primary },
          ]}
          labelStyle={{ color: theme.colors.onPrimary }}
          icon="account-box-outline"
        >
          View Contacts
        </Button>

        <Button
          mode="outlined"
          onPress={() => router.push("/add")}
          style={[styles.outlineButton, { borderColor: theme.colors.primary }]}
          labelStyle={{ color: theme.colors.primary }}
          icon="plus"
        >
          Add Contact
        </Button>

        <Button
          mode="text"
          onPress={() => router.push("/(tabs)/profile")}
          style={styles.textButton}
          labelStyle={{ color: theme.colors.primary }}
          icon="cog-outline"
        >
          Profile & Settings
        </Button>
      </Surface>

      <Text style={[styles.footer, { color: theme.colors.primary }]}>
        © 2025 Card Vault • v1.0
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  card: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    borderRadius: 16,
  },
  heading: {
    marginBottom: 8,
    textAlign: "center",
  },
  subheading: {
    marginBottom: 16,
    textAlign: "center",
  },
  primaryButton: {
    marginVertical: 8,
    width: "100%",
  },
  outlineButton: {
    borderWidth: 1,
    marginVertical: 8,
    width: "100%",
  },
  textButton: {
    marginVertical: 8,
    width: "100%",
  },
  footer: {
    textAlign: "center",
    marginBottom: 12,
    fontSize: 12,
  },
});
