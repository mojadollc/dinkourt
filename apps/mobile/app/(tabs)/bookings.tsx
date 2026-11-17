import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { formatPHP, formatDate } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "#16a34a", PENDING: "#d97706", CANCELLED: "#dc2626", COMPLETED: "#6b7280",
};

export default function BookingsScreen() {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => api.get("/api/player/bookings").then(r => r.data),
  });

  return (
    <View style={s.container}>
      {isLoading ? (
        <ActivityIndicator color="#16a34a" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(b: any) => b.id}
          contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
          renderItem={({ item: b }) => (
            <View style={s.card}>
              <View style={s.row}>
                <Text style={s.court}>{b.court.name}</Text>
                <Text style={[s.status, { color: STATUS_COLORS[b.status] ?? "#6b7280" }]}>
                  {b.status}
                </Text>
              </View>
              <Text style={s.venue}>{b.court.venue.name}</Text>
              <Text style={s.date}>{formatDate(b.slot.startTime)}</Text>
              <Text style={s.amount}>{formatPHP(Number(b.totalAmount))}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={s.empty}>No bookings yet.</Text>}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  court: { fontSize: 15, fontWeight: "700", color: "#111827" },
  status: { fontSize: 12, fontWeight: "600" },
  venue: { color: "#6b7280", fontSize: 13, marginTop: 2 },
  date: { color: "#6b7280", fontSize: 13, marginTop: 4 },
  amount: { color: "#16a34a", fontWeight: "700", marginTop: 6 },
  empty: { textAlign: "center", color: "#9ca3af", marginTop: 40 },
});
