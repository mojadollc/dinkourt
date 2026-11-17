import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/lib/api";

export default function RegisterScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!form.name || !form.email || !form.password) return;
    setLoading(true);
    try {
      await api.post("/api/mobile/auth/register", form);
      Alert.alert("Success", "Account created! Please sign in.", [
        { text: "OK", onPress: () => router.replace("/(auth)/login") },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e.response?.data?.error ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
      <Text style={s.logo}>🏓 Dinkourt</Text>
      <Text style={s.subtitle}>Create your player account</Text>
      <View style={s.form}>
        {(["name", "email", "password"] as const).map(field => (
          <TextInput key={field} style={s.input}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]} onChangeText={v => setForm(f => ({ ...f, [field]: v }))}
            secureTextEntry={field === "password"}
            keyboardType={field === "email" ? "email-address" : "default"}
            autoCapitalize={field === "email" || field === "password" ? "none" : "words"} />
        ))}
        <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={handleRegister} disabled={loading}>
          <Text style={s.btnText}>{loading ? "Registering…" : "Create Account"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.link}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#fff", justifyContent: "center", padding: 24 },
  logo: { fontSize: 32, fontWeight: "800", color: "#16a34a", textAlign: "center" },
  subtitle: { color: "#6b7280", textAlign: "center", marginTop: 4, marginBottom: 32 },
  form: { gap: 12 },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 10, padding: 14, fontSize: 16 },
  btn: { backgroundColor: "#16a34a", borderRadius: 10, padding: 14, alignItems: "center" },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  link: { color: "#16a34a", textAlign: "center", marginTop: 8 },
});
