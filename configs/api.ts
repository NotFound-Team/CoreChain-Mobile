export const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const API_ENDPOINT = {
  AUTH: {
    REFRESH: `${BASE_URL}/auth/refresh`,
    ACCOUNT: `${BASE_URL}/auth/account`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    LOGIN: `${BASE_URL}/auth/login`,
  },
  TASK: `${BASE_URL}/tasks`,
  PROJECT: `${BASE_URL}/projects`,
};
