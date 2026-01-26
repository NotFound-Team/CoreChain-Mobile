import { API_ENDPOINT } from "@/configs/api";
import { handleApiError, handleApiResponse } from "@/helpers/api";
import instanceAxios from "@/utils/axios";

export const uploadFile = async (file: any) => {
  try {
    const formData = new FormData();
    formData.append("fileUpload", {
      uri: file.uri,
      name: file.fileName || "image.jpg",
      type: file.mimeType || "image/jpeg",
    } as any);

    const res = await instanceAxios.post(API_ENDPOINT.FILE.UPLOAD, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};
