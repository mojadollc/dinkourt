import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { formatPHP } from "@/lib/utils";

export default function VenueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const { data: venue, isLoading } = useQuery({
    queryKey: ["venue", id],
    queryFn: () => api.get(`/api/mobile/venues/${id}`).then(r => r.data),
  });

  async function joinMembership(planId: string) {
    try {
      await api.post("/api/player/memberships", { planId });
      Alert.alert("Success", "Membership activated!");
      qc.invalidateQueries({ queryKey: ["my-memberships"] });
    } catch (e: any) {
      Alert.alert("Error", e.response?.data?.error ?? "Failed to join");
    }
  }

  if (isLoading) return <ActivityIndicator color="#16a34a" style={{ marginTop: 80 }} />;
  if (!venue) return <Text style={{ padding: 20 }}>Venue not found.</Text>;

  return (
    <ScrollView style={s.container}>
      <View style={s.header}>
        <Text style={s.name}>{venue.name}</Text>
        <Text style={s.location}>{venue.address}, {venue.city}</Text>
        {venue.description && <Text style={s.desc}>{venue.description}</Text>}
      </View>

      <Text style={s.section}>Courts</Text>
      {venue.courts?.map((c: any) => (
        <TouchableOpacity key={c.id} style={s.card}
          onPress={() => router.push(`/venue/${id}/book?courtId=${c.id}`)}>
          <View style={s.row}>
            <Text style={s.courtName}>{c.name}</Text>
            <Text style={s.price}>{formatPHP(Number(c.hourlyRate))}/hr</Text>
          </View>
          {c.description && <Text style={s.courtDesc}>{c.description}</Text>}
          <Text style={s.bookBtn}>Book →</Text>
        </TouchableOpacity>
      ))}

      {venue.memberships?.length > 0 && (
        <>
          <Text style={s.section}>Memberships</Text>
          {venue.memberships.map((p: any) => (
            <View key={p.id} style={s.card}>
              <View style={s.row}>
                <Text style={s.courtName}>{p.name}</Text>
                <Text style={s.price}>{formatPHP(Number(p.price))}/{p.interval.toLowerCase()}</Text>
              </View>
              {p.description && <Text style={s.courtDesc}>{p.description}</Text>}
              {Number(p.bookingDiscount) > 0 && (
                <Text style={s.discount}>{(Number(p.bookingDiscount) * 100).toFixed(0)}% booking discount</Text>
              )}
              <TouchableOpacity style={s.joinBtn} onPress={() => joinMembership(p.id)}>
                <Text style={s.joinBtnText}>Join Membership</Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: { backgroundColor: "#16a34a", padding: 20 },
  name: { fontSize: 22, fontWeight: "800", color: "#fff" },
  location: { color: "#dcfce7", marginTop: 4 },
  desc: { color: "#dcfce7", marginTop: 8, fontSize: 13 },
  section: { fontSize: 16, fontWeight: "700", color: "#111827", padding: 16, paddingBottom: 8 },
  card: { backgroundColor: "#fff", marginHorizontal: 16, marginBottom: 12, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  courtName: { fontSize: 15, fontWeight: "700", color: "#111827" },
  price: { color: "#16a34a", fontWeight: "700" },
  courtDesc: { color: "#6b7280", fontSize: 13, marginTop: 4 },
  bookBtn: { color: "#16a34a", fontWeight: "600", marginTop: 8 },
  discount: { color: "#16a34a", fontSize: 12, marginTop: 4 },
  joinBtn: { backgroundColor: "#16a34a", borderRadius: 8, padding: 10, alignItems: "center", marginTop: 10 },
  joinBtnText: { color: "#fff", fontWeight: "700" },
});
