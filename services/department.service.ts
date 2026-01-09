import { API_ENDPOINT } from "@/configs/api";
import { handleApiError, handleApiResponse } from "@/helpers/api";
import { ApiResponse } from "@/types/api";
import { DepartmentQueryParams, IDepartment } from "@/types/department";
import instanceAxios from "@/utils/axios";

export const getDepartments = async (
  params: DepartmentQueryParams
): Promise<ApiResponse<IDepartment[]>> => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.DEPARTMENT.INDEX}`, {
      params,
    });
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const getDetailDepartment = async (
  id: string
): Promise<ApiResponse<IDepartment>> => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.DEPARTMENT.DETAIL(id)}`);
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};
