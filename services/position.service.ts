import { API_ENDPOINT } from "@/configs/api";
import { handleApiError, handleApiResponse } from "@/helpers/api";
import { ApiResponse } from "@/types/api";
import { IPosition, PositionQueryParams } from "@/types/position";
import instanceAxios from "@/utils/axios";

export const getPositions = async (
  params: PositionQueryParams
): Promise<ApiResponse<IPosition[]>> => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.POSITION.INDEX}`, { params });
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};
