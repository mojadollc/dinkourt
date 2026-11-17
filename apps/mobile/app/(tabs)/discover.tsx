import { useState } from "react";
import {
  View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { api } from "@/lib/api";

export default function DiscoverScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data: venues = [], isLoading } = useQuery({
    queryKey: ["venues", search],
    queryFn: () => api.get(`/api/player/venues?search=${search}`).then(r => r.data),
  });

  return (
    <View style={s.container}>
      <TextInput style={s.search} placeholder="Search venues or cities…"
        value={search} onChangeText={setSearch} />
      {isLoading ? (
        <ActivityIndicator color="#16a34a" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={venues}
          keyExtractor={(v: any) => v.id}
          contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
          renderItem={({ item: v }) => (
            <TouchableOpacity style={s.card} onPress={() => router.push(`/venue/${v.id}`)}>
              <Text style={s.venueName}>{v.name}</Text>
              <Text style={s.venueCity}>{v.city}, {v.province}</Text>
              <View style={s.row}>
                <Text style={s.courts}>{v._count.courts} courts</Text>
                {v.courts.length > 0 && (
                  <Text style={s.price}>
                    From ₱{Math.min(...v.courts.map((c: any) => Number(c.hourlyRate)))}/hr
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={s.empty}>No venues found.</Text>}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
  search: {
    backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e7eb",
    borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 15,
  },
  card: {
    backgroundColor: "#fff", borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: "#e5e7eb",
  },
  venueName: { fontSize: 16, fontWeight: "700", color: "#111827" },
  venueCity: { color: "#6b7280", marginTop: 2, fontSize: 13 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  courts: { color: "#6b7280", fontSize: 13 },
  price: { color: "#16a34a", fontWeight: "600", fontSize: 13 },
  empty: { textAlign: "center", color: "#9ca3af", marginTop: 40 },
});
