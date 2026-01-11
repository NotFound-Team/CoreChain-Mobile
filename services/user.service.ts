import { API_ENDPOINT } from "@/configs/api";
import { handleApiError, handleApiResponse } from "@/helpers/api";
import { ApiResponse } from "@/types/api";
import instanceAxios from "@/utils/axios";

export const getUserDetails = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.USER.DETAIL(id)}`);
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const searchUsers = async (name: string): Promise<ApiResponse<any[]>> => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.USER.INDEX}?name=/${name}/g`);
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};
