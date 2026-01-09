import { API_ENDPOINT } from "@/configs/api";
import { handleApiError, handleApiResponse } from "@/helpers/api";
import { ApiResponse } from "@/types/api";
import { TQueryPersonnelSalary, TSalaryAdvanceCreate } from "@/types/personnel";
import instanceAxios from "@/utils/axios";

export const salaryAdvance = async (
  data: TSalaryAdvanceCreate
): Promise<ApiResponse<any>> => {
  try {
    const res = await instanceAxios.post(
      API_ENDPOINT.PERSONNEL.SALARY_ADVANCE,
      data
    );
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const getSalaryList = async (
  params: TQueryPersonnelSalary
): Promise<ApiResponse<any>> => {
  try {
    const query = new URLSearchParams(
      params as Record<string, string>
    ).toString();

    const res = await instanceAxios.get(
      `${API_ENDPOINT.PERSONNEL.SALARY_ADVANCE}?${query}`
    );
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};
