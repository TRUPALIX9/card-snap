"use client";
import { useEffect, useState, useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Avatar,
  useTheme,
  List,
  Switch,
  ActivityIndicator,
  Divider,
} from "react-native-paper";
import axios from "axios";
import { ThemeContext } from "@/context/ThemeContext";

interface IUser {
  _id: string;
  fullName: string;
  email: string;
}

export default function UserProfileScreen() {
  const theme = useTheme();
  const { theme: appTheme, toggleTheme } = useContext(ThemeContext);
  const isDark = appTheme === "dark";

  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.EXPO_PUBLIC_API_URL}/api/user/me`)
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  if (loading) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {user ? (
          <>
            <Avatar.Text
              size={96}
              label={getInitials(user.fullName)}
              style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
            />
            <Text
              variant="headlineMedium"
              style={{ color: theme.colors.primary }}
            >
              {user.fullName}
            </Text>
            <Text style={{ color: theme.colors.onSurface }}>{user.email}</Text>

            <Divider
              style={[
                styles.divider,
                { backgroundColor: theme.colors.outline },
              ]}
            />

            <View style={styles.section}>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.primary }}
              >
                Settings
              </Text>
              <List.Item
                title="Dark Mode"
                titleStyle={{ color: theme.colors.onSurface }}
                left={() => (
                  <List.Icon
                    icon="theme-light-dark"
                    color={theme.colors.primary}
                  />
                )}
                right={() => (
                  <Switch
                    value={isDark}
                    onValueChange={toggleTheme}
                    color={theme.colors.primary}
                  />
                )}
              />
            </View>
          </>
        ) : (
          <Text style={{ marginTop: 100, color: theme.colors.error }}>
            Failed to load profile.
          </Text>
        )}
        <Text style={[styles.footer, { color: theme.colors.outline }]}>
          © 2025 Card Vault • Profile
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    padding: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    marginTop: 32,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    width: "100%",
    marginVertical: 24,
  },
  section: {
    width: "100%",
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    paddingVertical: 12,
  },
});
