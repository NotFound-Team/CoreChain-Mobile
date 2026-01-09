import { API_ENDPOINT } from "@/configs/api";
import { handleApiError, handleApiResponse } from "@/helpers/api";
import { ApiResponse } from "@/types/api";
import { IProject, ProjectQueryParams } from "@/types/project";
import instanceAxios from "@/utils/axios";

export const getProjects = async (
  params: ProjectQueryParams
): Promise<ApiResponse<IProject[]>> => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.PROJECT.INDEX}`, { params });
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};