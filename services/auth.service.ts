import { API_ENDPOINT } from "@/configs/api";
import { handleApiError, handleApiResponse } from "@/helpers/api";
import { ApiResponse } from "@/types/api";
import axios from "axios";

export const loginAuth = async (data: any): Promise<ApiResponse<any>> => {
  try {
    const res = await axios.post(`${API_ENDPOINT.AUTH.LOGIN}`, data);
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};
