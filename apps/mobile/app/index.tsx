import { Redirect } from "expo-router";
import { useAuth } from "@/lib/auth-context";

export default function Index() {
  const { token } = useAuth();
  return <Redirect href={token ? "/(tabs)/discover" : "/(auth)/login"} />;
}
