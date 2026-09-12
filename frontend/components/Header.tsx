import { Appbar, useTheme } from "react-native-paper";
import { usePathname, useRouter } from "expo-router";
import { Platform, SafeAreaView } from "react-native";

export default function Header() {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const showBack = pathname !== "/";

  const getTitle = () => {
    if (pathname.includes("/contacts/")) return "Contact Info";
    if (pathname.includes("/contacts")) return "Contacts";
    return "Card Vault";
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.surface,
      }}
    >
      <Appbar.Header
        style={{
          backgroundColor: theme.colors.surface,
          height: 48,
          borderBottomWidth: 1,
          borderBottomColor: "#FFFFFF",
          elevation: 0,
        }}
      >
        {showBack && <Appbar.BackAction onPress={() => router.back()} />}
        <Appbar.Content
          title={getTitle()}
          titleStyle={{
            fontWeight: "bold",
            fontSize: 17,
            color: theme.colors.onSurface,
          }}
        />
      </Appbar.Header>
    </SafeAreaView>
  );
}
