import { Appbar, useTheme } from "react-native-paper";
import { usePathname, useRouter } from "expo-router";

// Top-level tab routes: these are roots, so they get no back arrow.
const TAB_ROOTS = ["/", "/contacts", "/profile"];

export default function Header() {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const showBack = !TAB_ROOTS.includes(pathname);

  const getTitle = () => {
    if (pathname.startsWith("/contacts/")) return "Contact Info";
    if (pathname === "/contacts") return "Contacts";
    if (pathname === "/profile") return "Profile";
    if (pathname === "/add/scan") return "Scan Business Card";
    if (pathname.startsWith("/add")) return "Add Contact";
    return "Card Vault";
  };

  // Appbar.Header already pads the top safe-area inset. Wrapping it in
  // react-native's SafeAreaView padded the same inset again on iOS, which
  // left an empty band above the bar.
  return (
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
  );
}
