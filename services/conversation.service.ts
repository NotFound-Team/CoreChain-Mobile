import { API_ENDPOINT } from "@/configs/api";
import { handleApiError, handleApiResponse } from "@/helpers/api";
import { ApiResponse } from "@/types/api";
import { instanceCommunication } from "@/utils/axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export interface Conversation {
    id: number;
    name: string;
    avatar?: string;
    is_group: boolean;
    last_message_at?: string;
    last_message_content?: string;
    last_message_id?: number;
    last_message_sender_id?: string;
    last_read_message_id?: number;
    unread_count?: number;
    members?: {
        avatar: string;
        full_name: string;
        role: string;
        user_id: string;
    }[];
    messages?: Message[];
}

export interface Message {
    id?: number;
    temp_id?: string;
    conversation_id: number;
    sender_id: string;
    content: string;
    type: string;
    created_at: string;
    is_pending?: boolean;
    file_path?: string;
    file_url?: string;
    file_name?: string;
    file_type?: string;
}

export interface OutgoingMessage {
    temp_id: string;
    conversation_id: number;
    sender_id: string;
    content: string;
    type: string;
}

export const getConversations = async (): Promise<ApiResponse<Conversation[]>> => {
    try {
        const res = await instanceCommunication.get(API_ENDPOINT.CONVERSATION.INDEX);
        console.log("get conversation: ", res.data);
        return handleApiResponse(res);
    } catch (error: any) {
        console.log("get conversation error")
        return handleApiError(error);
    }
};

export const createPrivateConversation = async (partnerId: string): Promise<ApiResponse<any>> => {
    try {
        const res = await instanceCommunication.post(API_ENDPOINT.CONVERSATION.PRIVATE, {
            partner_id: partnerId,
        });
        console.log("create private conversation: ", res.data);
        return handleApiResponse(res);
    } catch (error: any) {
        return handleApiError(error);
    }
};

export const getConversationDetail = async (id: string): Promise<ApiResponse<Conversation>> => {
    try {
        const res = await instanceCommunication.get(`${API_ENDPOINT.CONVERSATION.DETAIL}?id=${id}`);
        return handleApiResponse(res);
    } catch (error: any) {
        console.log("get conversation detail error", error)
        return handleApiError(error);
    }
};

export const uploadFile = async (fileUri: string, fileName: string, fileType: string): Promise<ApiResponse<any>> => {
    try {
        const accessToken = await SecureStore.getItemAsync("access_token");
        const formData = new FormData();

        const fileToUpload = {
            uri: Platform.OS === "android" ? fileUri : fileUri.replace("file://", ""),
            name: fileName || 'upload.jpg',
            type: fileType || 'image/jpeg',
        };

        // @ts-ignore
        formData.append("file", fileToUpload);

        console.log("Starting upload with FETCH to:", process.env.EXPO_PUBLIC_API_URL_COMMUNICATION + API_ENDPOINT.CONVERSATION.UPLOAD);

        const response = await fetch(process.env.EXPO_PUBLIC_API_URL_COMMUNICATION + API_ENDPOINT.CONVERSATION.UPLOAD, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json',
            },
        });

        const result = await response.json();

        if (response.ok) {
            return { data: result, isError: false, message: "Success", status: response.status };
        } else {
            return { data: null, isError: true, message: result.message || "Upload failed", status: response.status };
        }
    } catch (error: any) {
        console.error("Fetch Upload Error:", error);
        return { data: null, isError: true, message: error.message, status: 500 };
    }
};