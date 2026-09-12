// manual.tsx
"use client";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

const schema = yup.object({
  fullName: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email"),
  company: yup.string(),
});

export default function ManualContactEntry() {
  const theme = useTheme();
  const router = useRouter();
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/contacts`, data);
      reset();
      router.back();
    } catch (err) {
      alert("Failed to save contact");
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text variant="headlineMedium" style={styles.title}>
        Enter Contact Info
      </Text>

      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextInput
            label="Full Name"
            value={value}
            onChangeText={onChange}
            error={!!error}
            style={styles.input}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextInput
            label="Email"
            value={value}
            onChangeText={onChange}
            error={!!error}
            style={styles.input}
            keyboardType="email-address"
          />
        )}
      />

      <Controller
        control={control}
        name="company"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Company"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        buttonColor="#1976D2"
        style={styles.submitButton}
      >
        Save Contact
      </Button>
      <Button onPress={() => router.back()} style={styles.backButton}>
        Cancel
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
  backButton: {
    alignSelf: "center",
    marginTop: 16,
  },
});
