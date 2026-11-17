import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { formatPHP, formatDate } from "@/lib/utils";

export default function MembershipsScreen() {
  const { data: memberships = [], isLoading } = useQuery({
    queryKey: ["my-memberships"],
    queryFn: () => api.get("/api/mobile/player/memberships").then(r => r.data),
  });

  return (
    <View style={s.container}>
      {isLoading ? (
        <ActivityIndicator color="#16a34a" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={memberships}
          keyExtractor={(m: any) => m.id}
          contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
          renderItem={({ item: m }) => (
            <View style={s.card}>
              <View style={s.row}>
                <Text style={s.planName}>{m.plan.name}</Text>
                <Text style={[s.badge, m.isActive ? s.active : s.inactive]}>
                  {m.isActive ? "Active" : "Expired"}
                </Text>
              </View>
              <Text style={s.venue}>{m.plan.venue?.name}</Text>
              <Text style={s.price}>{formatPHP(Number(m.plan.price))} / {m.plan.interval.toLowerCase()}</Text>
              <Text style={s.date}>Expires {formatDate(m.endDate)}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={s.empty}>No memberships yet.</Text>}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  planName: { fontSize: 15, fontWeight: "700", color: "#111827" },
  badge: { fontSize: 11, fontWeight: "600", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  active: { backgroundColor: "#dcfce7", color: "#16a34a" },
  inactive: { backgroundColor: "#f3f4f6", color: "#6b7280" },
  venue: { color: "#6b7280", fontSize: 13, marginTop: 2 },
  price: { color: "#16a34a", fontWeight: "600", marginTop: 6 },
  date: { color: "#9ca3af", fontSize: 12, marginTop: 2 },
  empty: { textAlign: "center", color: "#9ca3af", marginTop: 40 },
});
