import { SignInFormData } from "@/components/SignInModal";
import { loginAuth } from "@/services/auth.service";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name: string;
  roleName: string;
}

interface TokenType {
  accessToken: string;
}

interface AuthState {
  user: User | null;
  token: TokenType | null;
  isAuthenticated: boolean;
  redirectRoute: string | null;
  setRedirectRoute: (route: string) => void;
  login: (data: SignInFormData) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  redirectRoute: null,
  setRedirectRoute: (route: string) => {
    set({ redirectRoute: route });
  },
  login: async (data: SignInFormData) => {
    try {
      // call service
      const res = await loginAuth(data);
      const { access_token, user } = res.data;

      await SecureStore.setItemAsync("access_token", access_token);

      set({
        token: { accessToken: access_token },
        isAuthenticated: true,
        user: {
          email: user.email,
          id: user._id,
          name: user.name,
          roleName: user.role.name,
        },
      });
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Login failed");
    }
  },

  register: async (data: any) => {
    try {
      const res = await axios.post("https://api.example.com/register", data);
      const { accessToken, user } = res.data;

      await SecureStore.setItemAsync("access_token", accessToken);
      // set({ user, accessToken, isAuthenticated: true });
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Register failed");
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("access_token");
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadStoredToken: async () => {
    const token = await SecureStore.getItemAsync("access_token");
    if (token) {
      try {
        const res = await axios.get("https://api.example.com/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // set({ user: res.data, accessToken: token, isAuthenticated: true });
      } catch {
        await SecureStore.deleteItemAsync("access_token");
        set({ user: null, token: null, isAuthenticated: false });
      }
    }
  },
}));
