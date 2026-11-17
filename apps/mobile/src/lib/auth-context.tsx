import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

interface AuthUser { id: string; name: string; email: string; role: string }
interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  setToken: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null, user: null, setToken: () => {}, logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync("auth_token").then(t => {
      if (t) setTokenState(t);
    });
    SecureStore.getItemAsync("auth_user").then(u => {
      if (u) setUser(JSON.parse(u));
    });
  }, []);

  function setToken(t: string) {
    SecureStore.setItemAsync("auth_token", t);
    setTokenState(t);
    try {
      const payload = JSON.parse(atob(t.split(".")[1]));
      const u = { id: payload.sub, name: payload.name, email: payload.email, role: payload.role };
      setUser(u);
      SecureStore.setItemAsync("auth_user", JSON.stringify(u));
    } catch {}
  }

  function logout() {
    SecureStore.deleteItemAsync("auth_token");
    SecureStore.deleteItemAsync("auth_user");
    setTokenState(null);
    setUser(null);
  }

  return <AuthContext.Provider value={{ token, user, setToken, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
