import { API_ENDPOINT } from "@/configs/api";
import { handleApiError, handleApiResponse } from "@/helpers/api";
import { ApiResponse } from "@/types/api";
import { TaskQueryParams } from "@/types/task";
import instanceAxios from "@/utils/axios";

export const getTasks = async (
  params: TaskQueryParams
): Promise<ApiResponse<any>> => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.TASK.INDEX}`, {
      params,
    });
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const getTaskDetail = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.TASK.DETAIL(id)}`);
    return handleApiResponse(res);
  } catch (error: any) {
    console.log(error)
    return handleApiError(error);
  }
};
