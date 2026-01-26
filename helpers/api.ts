import { ApiResponse, HttpStatus } from "@/types/api";

export const handleApiError = (error: any): ApiResponse<any> => {
  console.error("API error", error);

  if (error.response) {
    return {
      data: null,
      isError: true,
      status: error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.response.data?.message || "An error occurred",
    };
  } else if (error.request) {
    return {
      data: null,
      isError: true,
      status: HttpStatus.SERVICE_UNAVAILABLE,
      message: "No response received from server",
    };
  } else {
    return {
      data: null,
      isError: true,
      status: HttpStatus.BAD_REQUEST,
      message: `Request error: ${error.message}`,
    };
  }
};

export function handleApiResponse<T>(res: any): ApiResponse<T> {
  if (res && res.data) {
    return {
      data: res.data.data ?? null,
      isError: false,
      status: res.data.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      message: res.data.message ?? "No message provided",
    };
  }

  return {
    data: null,
    isError: true,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "Unexpected API response format",
  };
}
