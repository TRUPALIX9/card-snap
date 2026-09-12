"use client";
import { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Platform,
} from "react-native";
import { Searchbar, List, FAB, useTheme, Text } from "react-native-paper";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";

interface IContact {
  _id: string;
  fullName?: string;
  email?: string;
  company?: string;
  jobTitle?: string;
  phone?: string;
}

export default function ContactsPage() {
  const theme = useTheme();
  const router = useRouter();
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [filtered, setFiltered] = useState<IContact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadError, setLoadError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchContacts = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/contacts`
      );
      setContacts(Array.isArray(res.data) ? res.data : []);
      setLoadError(false);
    } catch (err) {
      console.error("Failed to load contacts", err);
      setLoadError(true);
    }
  }, []);

  // Refetch whenever the tab gains focus, so a contact saved from the add
  // flow shows up without restarting the app.
  useFocusEffect(
    useCallback(() => {
      fetchContacts();
    }, [fetchContacts])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchContacts();
    setRefreshing(false);
  };

  useEffect(() => {
    // Only fullName, email and company are required by the schema, but older
    // or externally created records may lack them; don't crash on those.
    const q = searchQuery.toLowerCase();
    setFiltered(
      contacts.filter((c) =>
        [c.fullName, c.email, c.company].some((v) =>
          (v ?? "").toLowerCase().includes(q)
        )
      )
    );
  }, [searchQuery, contacts]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Searchbar
        placeholder="Search contacts..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={[{ backgroundColor: theme.colors.surface }]}
        inputStyle={{
          fontSize: 15,
          paddingVertical: Platform.OS === "android" ? 2 : 6,
          color: theme.colors.onSurface,
        }}
        placeholderTextColor={theme.colors.onSurface}
        iconColor={theme.colors.onSurface}
      />

      {filtered.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.colors.outline }]}>
            {loadError ? "Couldn't load contacts" : "No contacts found"}
          </Text>
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                shadowColor: theme.colors.outline,
              },
            ]}
          >
            <List.Item
              title={item.fullName || "Unnamed contact"}
              description={() => (
                <View style={{ marginTop: 4 }}>
                  <Text style={{ color: theme.colors.onSurface }}>
                    {item.jobTitle || "Contact"}
                    {item.company ? ` @ ${item.company}` : ""}
                  </Text>
                  {!!item.phone && (
                    <Text style={{ color: theme.colors.outline, marginTop: 2 }}>
                      Phone: {item.phone}
                    </Text>
                  )}
                  {!!item.email && (
                    <Text style={{ color: theme.colors.outline }}>
                      Email: {item.email}
                    </Text>
                  )}
                </View>
              )}
              titleStyle={{
                fontWeight: "600",
                fontSize: 17,
                color: theme.colors.onSurface,
              }}
              left={() => (
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <Text style={styles.avatarText}>
                    {(item.fullName || "?").charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              onPress={() => router.push(`../contacts/${item._id}`)}
            />
          </View>
        )}
        contentContainerStyle={[
          styles.listContent,
          { backgroundColor: theme.colors.background },
        ]}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => router.push("../add")}
        color={theme.colors.onPrimary}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  card: {
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 4,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 100,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 16,
    elevation: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.8,
  },
});
