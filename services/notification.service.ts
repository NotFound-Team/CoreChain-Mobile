import { API_ENDPOINT } from "@/configs/api";
import { handleApiError, handleApiResponse } from "@/helpers/api";
import { ApiResponse } from "@/types/api";
import { instanceNotification } from "@/utils/axios";
import { Ionicons } from "@expo/vector-icons";

/* ===== Types ===== */
export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  created_at: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}


/* ===== Get all notifications by user ===== */
export const getAllNotifications = async (
  userId: string
): Promise<ApiResponse<NotificationItem[]>> => {
  try {
    console.log(`calling: ${API_ENDPOINT.NOTIFICATION.INDEX}${userId}`)
    const res = await instanceNotification.get(
      `${API_ENDPOINT.NOTIFICATION.INDEX}${userId}`
    );
    res.data = {
      "data": res.data.data.notifications
    }
    console.log("Noti", res.data, res.status)
    return handleApiResponse(res);
  } catch (error: any) {
    return handleApiError(error);
  }
};