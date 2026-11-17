import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

export default function LoginScreen() {
  const router = useRouter();
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) return;
    setLoading(true);
    try {
      const res = await api.post("/api/mobile/auth/login", { email, password });
      setToken(res.data.token);
      router.replace("/(tabs)/discover");
    } catch {
      Alert.alert("Error", "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Text style={s.logo}>🏓 Dinkourt</Text>
      <Text style={s.subtitle}>Find & book pickleball courts</Text>
      <View style={s.form}>
        <TextInput style={s.input} placeholder="Email" value={email}
          onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={s.input} placeholder="Password" value={password}
          onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={handleLogin} disabled={loading}>
          <Text style={s.btnText}>{loading ? "Signing in…" : "Sign In"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
          <Text style={s.link}>New player? Register here</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center", padding: 24 },
  logo: { fontSize: 32, fontWeight: "800", color: "#16a34a", textAlign: "center" },
  subtitle: { color: "#6b7280", textAlign: "center", marginTop: 4, marginBottom: 32 },
  form: { gap: 12 },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 10, padding: 14, fontSize: 16 },
  btn: { backgroundColor: "#16a34a", borderRadius: 10, padding: 14, alignItems: "center" },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  link: { color: "#16a34a", textAlign: "center", marginTop: 8 },
});
