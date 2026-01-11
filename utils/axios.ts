import { RefreshTokenAuth } from "@/services/auth.service";
import axios, { AxiosInstance } from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({ baseURL });

  // ==== REQUEST INTERCEPTOR ====
  instance.interceptors.request.use((config) => {
    const accessToken = SecureStore.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  // ==== RESPONSE INTERCEPTOR ====
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const res = await RefreshTokenAuth();
          console.log(res);
          const accessToken = res.data.access_token;

          SecureStore.setItem("access_token", accessToken);
          processQueue(null, accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return instance(originalRequest);
        } catch (err) {
          processQueue(err, null);
          router.push("/(auth)/signin");
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const instanceAxios = createAxiosInstance(process.env.EXPO_PUBLIC_API_URL as string);

const instanceCommunication = createAxiosInstance(process.env.EXPO_PUBLIC_API_URL_COMMUNICATION as string);

export default instanceAxios;

export { instanceCommunication };
