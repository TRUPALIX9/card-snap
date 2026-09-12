"use client";
import { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import axios from "axios";

export default function ManualAddPage() {
  const theme = useTheme();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    company: "",
    phone: "",
    jobTitle: "",
    department: "",
    industry: "",
    website: "",
    address: "",
    notes: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { fullName, email, company } = form;

    if (!fullName || !email || !company) {
      Alert.alert(
        "Missing Fields",
        "Full Name, Email, and Company are required."
      );
      return;
    }

    try {
      await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/contacts`, form);
      router.push("/(tabs)/contacts");
    } catch (err) {
      console.error("Failed to add contact", err);
      Alert.alert("Error", "Failed to save contact. Please try again.");
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text
        variant="titleLarge"
        style={[styles.title, { color: theme.colors.primary }]}
      >
        Add Contact Manually
      </Text>

      {[
        "fullName",
        "email",
        "company",
        "phone",
        "jobTitle",
        "department",
        "industry",
        "website",
        "address",
        "notes",
      ].map((field) => (
        <TextInput
          key={field}
          label={field.charAt(0).toUpperCase() + field.slice(1)}
          value={(form as any)[field]}
          onChangeText={(text) => handleChange(field, text)}
          mode="outlined"
          style={styles.input}
          multiline={field === "notes" || field === "address"}
          numberOfLines={field === "notes" || field === "address" ? 3 : 1}
        />
      ))}

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        Save Contact
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    marginBottom: 12,
  },
  submitButton: {
    marginTop: 16,
  },
});
