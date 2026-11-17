import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? "http://localhost:3000";

export const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(async config => {
  const token = await SecureStore.getItemAsync("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
