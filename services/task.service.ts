import { API_ENDPOINT } from "@/configs/api";
import { handleApiError, handleApiResponse } from "@/helpers/api";
import { ApiResponse } from "@/types/api";
import { TaskQueryParams } from "@/types/task";
import instanceAxios from "@/utils/axios";

export const getTasks = async (
  params: TaskQueryParams,
): Promise<ApiResponse<any>> => {
  console.log("getTasks params:", params);
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.TASK.INDEX}`, {
      params,
    });
    console.log("getTasks response:", res.data);
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
    console.log(error);
    return handleApiError(error);
  }
};

export const createTask = async (data: any): Promise<ApiResponse<any>> => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.TASK.INDEX}`, data);
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const updateTask = async (
  id: string,
  data: any,
): Promise<ApiResponse<any>> => {
  try {
    const res = await instanceAxios.patch(
      `${API_ENDPOINT.TASK.DETAIL(id)}`,
      data,
    );
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const deleteTask = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.TASK.DETAIL(id)}`);
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const getTasksByDay = async (
  startDate?: string,
  dueDate?: string,
): Promise<ApiResponse<any>> => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.TASK.BY_DAY}`, {
      params: { startDate, dueDate },
    });
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};
