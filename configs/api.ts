export const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const API_ENDPOINT = {
  AUTH: {
    REFRESH_TOKEN: `${BASE_URL}/auth/refresh-token`,
    AUTH_ME: `${BASE_URL}/auth/me`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    OTP: `${BASE_URL}/auth/otp`,
  },
};
