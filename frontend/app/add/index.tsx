"use client";
import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useTheme, Text, Button } from "react-native-paper";

export default function AddContactPage() {
  const theme = useTheme();
  const router = useRouter();

  const handleOption = (route: any) => {
    router.push(route);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>
          Add a Contact
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>
          Choose how you’d like to add a new contact to your vault.
        </Text>
      </View>

      <View style={styles.options}>
        <Button
          mode="contained"
          onPress={() => handleOption("/add/scan")}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          contentStyle={styles.buttonContent}
          labelStyle={styles.label}
        >
          Scan Business Card
        </Button>

        <Button
          mode="contained"
          onPress={() => handleOption("/add/manual")}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          contentStyle={styles.buttonContent}
          labelStyle={styles.label}
        >
          Enter Info Manually
        </Button>

        <Button
          mode="text"
          onPress={() => router.back()}
          textColor={theme.colors.primary}
          style={styles.cancelButton}
          labelStyle={styles.cancelLabel}
        >
          Cancel
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
    marginTop: 8,
    paddingHorizontal: 12,
  },
  options: {
    gap: 16,
  },
  button: {
    borderRadius: 10,
    elevation: 2,
  },
  buttonContent: {
    height: 52,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    textTransform: "none",
  },
  cancelButton: {
    marginTop: 16,
    alignSelf: "center",
  },
  cancelLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
});
