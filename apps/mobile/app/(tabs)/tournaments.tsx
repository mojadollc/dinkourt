import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { formatPHP, formatDate } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  OPEN: "#16a34a", DRAFT: "#6b7280", IN_PROGRESS: "#2563eb",
  COMPLETED: "#9ca3af", CANCELLED: "#dc2626",
};

export default function TournamentsScreen() {
  const qc = useQueryClient();
  const { data: tournaments = [], isLoading } = useQuery({
    queryKey: ["tournaments"],
    queryFn: () => api.get("/api/mobile/tournaments").then(r => r.data),
  });

  async function register(tournamentId: string) {
    try {
      await api.post("/api/player/tournaments", { tournamentId });
      Alert.alert("Registered!", "You have been registered for this tournament.");
      qc.invalidateQueries({ queryKey: ["tournaments"] });
    } catch (e: any) {
      Alert.alert("Error", e.response?.data?.error ?? "Registration failed");
    }
  }

  return (
    <View style={s.container}>
      {isLoading ? (
        <ActivityIndicator color="#16a34a" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={tournaments}
          keyExtractor={(t: any) => t.id}
          contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
          renderItem={({ item: t }) => (
            <View style={s.card}>
              <View style={s.row}>
                <Text style={s.name}>{t.name}</Text>
                <Text style={[s.status, { color: STATUS_COLORS[t.status] ?? "#6b7280" }]}>
                  {t.status}
                </Text>
              </View>
              <Text style={s.venue}>{t.venue?.name}</Text>
              <Text style={s.date}>{formatDate(t.startDate)} – {formatDate(t.endDate)}</Text>
              <View style={s.footer}>
                <Text style={s.fee}>Entry: {formatPHP(Number(t.entryFee))}</Text>
                {t.status === "OPEN" && (
                  <TouchableOpacity style={s.btn} onPress={() => register(t.id)}>
                    <Text style={s.btnText}>Register</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={s.empty}>No tournaments available.</Text>}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  name: { fontSize: 15, fontWeight: "700", color: "#111827", flex: 1 },
  status: { fontSize: 12, fontWeight: "600" },
  venue: { color: "#6b7280", fontSize: 13, marginTop: 2 },
  date: { color: "#6b7280", fontSize: 13, marginTop: 4 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  fee: { color: "#16a34a", fontWeight: "600" },
  btn: { backgroundColor: "#16a34a", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  empty: { textAlign: "center", color: "#9ca3af", marginTop: 40 },
});
