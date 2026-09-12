"use client";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import {
  Text,
  Card,
  Avatar,
  useTheme,
  Appbar,
  Dialog,
  Portal,
  Button,
  TouchableRipple,
} from "react-native-paper";
import axios from "axios";

interface IContact {
  _id: string;
  fullName: string;
  email: string;
  company: string;
  jobTitle?: string;
  phone?: string;
}

export default function ContactDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();

  const [contact, setContact] = useState<IContact | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCallDialog, setShowCallDialog] = useState(false);

  const fetchContact = async () => {
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/contacts/${id}`
      );
      setContact(res.data);
    } catch (error) {
      console.error("Error fetching contact", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (contact?.phone) {
      Linking.openURL(`tel:${contact.phone}`);
    }
    setShowCallDialog(false);
  };

  const handleEmail = () => {
    if (contact?.email) {
      Linking.openURL(`mailto:${contact.email}`);
    }
  };

  useEffect(() => {
    fetchContact();
  }, [id]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Portal>
        <Dialog
          visible={showCallDialog}
          onDismiss={() => setShowCallDialog(false)}
        >
          <Dialog.Title>Call Contact</Dialog.Title>
          <Dialog.Content>
            <Text>Do you want to call {contact?.fullName}?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowCallDialog(false)}>Cancel</Button>
            <Button onPress={handleCall}>Call</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ marginTop: 32 }}
        />
      ) : contact ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Title
              title={contact.fullName}
              subtitle={`${contact.jobTitle || "Contact"} @ ${contact.company}`}
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="account"
                  color="white"
                  style={{ backgroundColor: theme.colors.primary }}
                />
              )}
              titleStyle={[styles.title, { color: theme.colors.onSurface }]}
              subtitleStyle={{ color: theme.colors.outline }}
            />

            <Card.Content>
              <Text style={[styles.label, { color: theme.colors.outline }]}>
                Contact Info
              </Text>

              {contact.phone && (
                <TouchableRipple
                  onPress={() => setShowCallDialog(true)}
                  rippleColor={theme.colors.primary}
                  style={styles.touchItem}
                >
                  <View>
                    <Text
                      style={[styles.label, { color: theme.colors.outline }]}
                    >
                      Phone
                    </Text>
                    <Text
                      style={[styles.value, { color: theme.colors.primary }]}
                    >
                      {contact.phone}
                    </Text>
                  </View>
                </TouchableRipple>
              )}

              <TouchableRipple
                onPress={handleEmail}
                rippleColor={theme.colors.primary}
                style={styles.touchItem}
              >
                <View>
                  <Text style={[styles.label, { color: theme.colors.outline }]}>
                    Email
                  </Text>
                  <Text style={[styles.value, { color: theme.colors.primary }]}>
                    {contact.email}
                  </Text>
                </View>
              </TouchableRipple>

              <Text
                style={[
                  styles.label,
                  { marginTop: 16, color: theme.colors.outline },
                ]}
              >
                🏢 Company
              </Text>
              <Text style={[styles.value, { color: theme.colors.onSurface }]}>
                {contact.company}
              </Text>

              {contact.jobTitle && (
                <>
                  <Text style={[styles.label, { color: theme.colors.outline }]}>
                    🧑‍💼 Job Title
                  </Text>
                  <Text
                    style={[styles.value, { color: theme.colors.onSurface }]}
                  >
                    {contact.jobTitle}
                  </Text>
                </>
              )}
            </Card.Content>
          </Card>
        </ScrollView>
      ) : (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Contact not found.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    backgroundColor: "transparent",
    elevation: 0,
  },
  appbarTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  content: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    elevation: 3,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  label: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    marginTop: 4,
  },
  errorText: {
    marginTop: 32,
    textAlign: "center",
    fontSize: 16,
  },
  touchItem: {
    marginTop: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
});
