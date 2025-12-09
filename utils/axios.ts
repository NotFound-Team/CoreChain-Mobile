import { BASE_URL } from "@/configs/api";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const instanceAxios = axios.create({
  baseURL: BASE_URL,
});

// ==== REQUEST INTERCEPTOR ====
instanceAxios.interceptors.request.use((config) => {
  const accessToken = "access_token";
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
    }
    return Promise.reject(error);
  }
);

export default instanceAxios;
