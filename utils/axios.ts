import { BASE_URL } from "@/configs/api";
import { RefreshTokenAuth } from "@/services/auth.service";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const instanceAxios = axios.create({
  baseURL: BASE_URL,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

// ==== REQUEST INTERCEPTOR ====
instanceAxios.interceptors.request.use((config) => {
  const accessToken = SecureStore.getItem("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ==== RESPONSE INTERCEPTOR ====
instanceAxios.interceptors.response.use(
  (response) => response,

  async (error: AxiosError & { config?: AxiosRequestConfig }) => {
    const originalRequest = error.config;

    console.log(error.response?.status);

    if (error.response?.status === 500 && !(originalRequest as any)?._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          console.log(token);
          originalRequest!.headers.Authorization = `Bearer ${token}`;
          return instanceAxios(originalRequest!);
        });
      }
      (originalRequest as any)!._retry = true;
      isRefreshing = true;

      try {
        const res = await RefreshTokenAuth();
        const accessToken = res.data.access_token;
        processQueue(null, accessToken);
        SecureStore.setItem("access_token", accessToken);

        originalRequest!.headers.Authorization = `Bearer ${accessToken}`;
        return instanceAxios(originalRequest!);
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

export default instanceAxios;
