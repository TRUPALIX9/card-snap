"use client";
import { useState } from "react";
import { StyleSheet, ScrollView, Alert, TextInputProps } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";

type FormField =
  | "fullName"
  | "email"
  | "company"
  | "phone"
  | "jobTitle"
  | "department"
  | "industry"
  | "website"
  | "address"
  | "notes";

const FIELDS: {
  key: FormField;
  label: string;
  multiline?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
}[] = [
  { key: "fullName", label: "Full name *", autoCapitalize: "words" },
  {
    key: "email",
    label: "Email *",
    keyboardType: "email-address",
    autoCapitalize: "none",
  },
  { key: "company", label: "Company *" },
  { key: "phone", label: "Phone", keyboardType: "phone-pad" },
  { key: "jobTitle", label: "Job title" },
  { key: "department", label: "Department" },
  { key: "industry", label: "Industry" },
  {
    key: "website",
    label: "Website",
    keyboardType: "url",
    autoCapitalize: "none",
  },
  { key: "address", label: "Address", multiline: true },
  { key: "notes", label: "Notes", multiline: true },
];

const asString = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? "";

export default function ManualAddPage() {
  const theme = useTheme();
  const router = useRouter();

  // Filled in by the scan screen with the fields read from the card.
  const params = useLocalSearchParams<{
    fullName?: string;
    email?: string;
    company?: string;
    phone?: string;
    scanned?: string;
  }>();
  const fromScan = asString(params.scanned) === "1";

  const [form, setForm] = useState<Record<FormField, string>>({
    fullName: asString(params.fullName),
    email: asString(params.email),
    company: asString(params.company),
    phone: asString(params.phone),
    jobTitle: "",
    department: "",
    industry: "",
    website: "",
    address: "",
    notes: "",
  });

  const handleChange = (field: FormField, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { fullName, email, company } = form;

    if (!fullName.trim() || !email.trim() || !company.trim()) {
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

      {fromScan && (
        <Text style={[styles.hint, { color: theme.colors.outline }]}>
          Review the details read from the card, then save.
        </Text>
      )}

      {FIELDS.map((field) => (
        <TextInput
          key={field.key}
          label={field.label}
          value={form[field.key]}
          onChangeText={(text) => handleChange(field.key, text)}
          mode="outlined"
          style={styles.input}
          keyboardType={field.keyboardType}
          autoCapitalize={field.autoCapitalize}
          multiline={field.multiline}
          numberOfLines={field.multiline ? 3 : 1}
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
  hint: {
    textAlign: "center",
    marginTop: -8,
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  submitButton: {
    marginTop: 16,
  },
});
