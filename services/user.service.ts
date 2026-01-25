import { API_ENDPOINT } from "@/configs/api";
import { handleApiError, handleApiResponse } from "@/helpers/api";
import { ApiResponse } from "@/types/api";
import { CompleteUser, PublicUser, UpdateFcmToken } from "@/types/user";
import instanceAxios from "@/utils/axios";

export interface UpdatePasswordDto {
  id: string;
  oldPassword: string;
  newPassword: string;
}

export const getUserDetails = async (
  id: string,
): Promise<ApiResponse<PublicUser>> => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.USER.DETAIL(id)}`);
    return handleApiResponse<PublicUser>(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const getUserIds = async (ids: string[]) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.USER.IDS}`, { ids });
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const getPrivateUserDetails = async (
  id: string,
): Promise<ApiResponse<CompleteUser>> => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.USER.PRIVATE(id)}`);
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const updatePassword = async (
  data: UpdatePasswordDto,
): Promise<ApiResponse<any>> => {
  try {
    const res = await instanceAxios.post(
      `${API_ENDPOINT.USER.CHANGE_PASSWORD}`,
      data,
    );
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const searchUsers = async (
  name: string,
  signal: AbortSignal | undefined,
) => {
  try {
    const res = await instanceAxios.get(
      `${API_ENDPOINT.USER.INDEX}?name=/${name}/g`,
      { signal },
    );
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const updateFcmToken = async ({
  fcmToken,
  id,
}: UpdateFcmToken & { id: string }) => {
  try {
    const res = await instanceAxios.patch(
      `${API_ENDPOINT.USER.FCM_TOKEN(id)}`,
      {
        fcmToken,
      },
    );
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};
