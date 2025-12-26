import { API_ENDPOINT } from "@/configs/api";
import { handleApiError, handleApiResponse } from "@/helpers/api";
import { ApiResponse } from "@/types/api";
import instanceAxios from "@/utils/axios";
import axios from "axios";

interface PermissionItem {
  _id: string;
  name: string;
  apiPath: string;
  method: string;
  module: string;
}
interface ResponseDataLogin {
  access_token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: {
      _id: string;
      name: string;
    };
    permissions: PermissionItem[];
  };
}

export const loginAuth = async (
  data: any
): Promise<ApiResponse<ResponseDataLogin>> => {
  try {
    const res = await axios.post(`${API_ENDPOINT.AUTH.LOGIN}`, data);
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const logoutAuth = async (): Promise<ApiResponse<any>> => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.AUTH.LOGOUT}`, {});
    console.log("RES-LOGOUT", res);
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const AccountAuth = async (): Promise<ApiResponse<any>> => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.AUTH.ACCOUNT}`);
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const RefreshTokenAuth = async (): Promise<ApiResponse<any>> => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.AUTH.REFRESH}`);
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};
