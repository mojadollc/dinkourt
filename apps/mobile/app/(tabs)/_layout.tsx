import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: "#16a34a",
      tabBarInactiveTintColor: "#9ca3af",
      headerStyle: { backgroundColor: "#16a34a" },
      headerTintColor: "#fff",
      headerTitleStyle: { fontWeight: "700" },
    }}>
      <Tabs.Screen name="discover" options={{
        title: "Discover",
        tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
      }} />
      <Tabs.Screen name="bookings" options={{
        title: "My Bookings",
        tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
      }} />
      <Tabs.Screen name="memberships" options={{
        title: "Memberships",
        tabBarIcon: ({ color, size }) => <Ionicons name="card" size={size} color={color} />,
      }} />
      <Tabs.Screen name="tournaments" options={{
        title: "Tournaments",
        tabBarIcon: ({ color, size }) => <Ionicons name="trophy" size={size} color={color} />,
      }} />
      <Tabs.Screen name="profile" options={{
        title: "Profile",
        tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
      }} />
    </Tabs>
  );
}
