import { SignInFormData } from "@/components/screens/signin/SignInModal";
import { loginAuth, logoutAuth } from "@/services/auth.service";
import { getUserDetails } from "@/services/user.service";
import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name: string;
  roleName: string;
  avatar?: string;
  positionName?: string;
  fcmToken?: string;
}

interface TokenType {
  accessToken: string;
}

interface JwtAccessTokenPayload extends JwtPayload {
  _id: string;
  name: string;
  email: string;
  role: {
    _id: string;
    name: string;
  };
}

interface AuthState {
  user: User | null;
  token: TokenType | null;
  isAuthenticated: boolean;
  redirectRoute: string | null;
  setRedirectRoute: (route: string) => void;
  setUser: (data: Partial<User>) => void;
  login: (data: SignInFormData) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, zustandGet) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  redirectRoute: null,
  setRedirectRoute: (route: string) => {
    set({ redirectRoute: route });
  },

  setUser: (data: Partial<User>) => {
    const currentUser = zustandGet().user;
    if (!currentUser) return;

    set({
      user: {
        ...currentUser,
        ...data,
      },
    });
  },

  login: async (data: SignInFormData) => {
    try {
      // call service
      const res = await loginAuth(data);
      const { access_token, user } = res.data;

      SecureStore.setItem("access_token", access_token);

      // Fetch additional user details
      let avatar = "";
      let positionName = "";
      let fcmToken = "";
      try {
        const detailsRes = await getUserDetails(user._id);
        if (detailsRes.data) {
          avatar = detailsRes.data.avatar;
          positionName = detailsRes.data.position?.title;
          fcmToken = detailsRes.data.fcmToken;
        }
      } catch (err) {
        console.error("Failed to fetch additional user details:", err);
      }

      set({
        token: { accessToken: access_token },
        isAuthenticated: true,
        user: {
          email: user.email,
          id: user._id,
          name: user.name,
          roleName: user.role.name,
          avatar,
          positionName,
          fcmToken,
        },
      });
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Login failed");
    }
  },

  register: async (data: any) => {
    try {
      const res = await axios.post("https://api.example.com/register", data);
      const { accessToken } = res.data;

      SecureStore.setItem("access_token", accessToken);
      // set({ user, accessToken, isAuthenticated: true });
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Register failed");
    }
  },

  logout: async () => {
    await logoutAuth();
    await SecureStore.deleteItemAsync("access_token");
    set({ user: null, token: null, isAuthenticated: false });
    router.replace("/(auth)/signin");
  },

  loadStoredToken: async () => {
    const token = SecureStore.getItem("access_token");
    if (token) {
      const decoded: JwtAccessTokenPayload = jwtDecode(token);
      try {
        const detailsRes = await getUserDetails(decoded._id);
        const { avatar, role, fcmToken, position, name, _id, email } =
          detailsRes.data;
        set({
          token: { accessToken: token },
          isAuthenticated: true,
          user: {
            email,
            id: _id,
            name,
            roleName: role.name,
            avatar,
            positionName: position.title,
            fcmToken,
          },
        });
      } catch {
        await SecureStore.deleteItemAsync("access_token");
        set({ user: null, token: null, isAuthenticated: false });
      }
    }
  },
}));
