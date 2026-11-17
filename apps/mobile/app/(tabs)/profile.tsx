import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/(auth)/login");
  }

  return (
    <View style={s.container}>
      <View style={s.avatar}>
        <Text style={s.avatarText}>{user?.name?.[0]?.toUpperCase() ?? "?"}</Text>
      </View>
      <Text style={s.name}>{user?.name ?? "Player"}</Text>
      <Text style={s.email}>{user?.email}</Text>
      <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
        <Text style={s.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", alignItems: "center", paddingTop: 60 },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: "#16a34a",
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 32, fontWeight: "800" },
  name: { fontSize: 22, fontWeight: "700", marginTop: 16, color: "#111827" },
  email: { color: "#6b7280", marginTop: 4 },
  logoutBtn: {
    marginTop: 40, borderWidth: 1, borderColor: "#dc2626",
    borderRadius: 10, paddingHorizontal: 32, paddingVertical: 12,
  },
  logoutText: { color: "#dc2626", fontWeight: "600" },
});
