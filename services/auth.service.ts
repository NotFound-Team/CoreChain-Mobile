import { API_ENDPOINT } from "@/configs/api";
import { handleApiError, handleApiResponse } from "@/helpers/api";
import { ApiResponse } from "@/types/api";
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
