import { API_ENDPOINT } from "@/configs/api";
import { handleApiError, handleApiResponse } from "@/helpers/api";
import { ApiResponse } from "@/types/api";
import { instanceCommunication } from "@/utils/axios";

export interface Meeting {
    id: number;
    title: string;
    description?: string;
    host_id: string;
    room_name: string;
    meeting_key: string;
    start_time: string;
    end_time?: string;
    is_active: boolean;
    created_at: string;
}

export interface CreateMeetingDto {
    title: string;
    description?: string;
    invited_user_ids?: string[];
    start_time?: string;
}

export interface JoinMeetingResponse {
    token: string;
    room_name: string;
    server_url: string;
}

export const getMeetings = async (): Promise<ApiResponse<Meeting[]>> => {
    try {
        const res = await instanceCommunication.get(API_ENDPOINT.MEETING.INDEX);
        return handleApiResponse(res);
    } catch (error: any) {
        return handleApiError(error);
    }
};

export const createMeeting = async (data: CreateMeetingDto): Promise<ApiResponse<Meeting>> => {
    try {
        const res = await instanceCommunication.post(API_ENDPOINT.MEETING.CREATE, data);
        return handleApiResponse(res);
    } catch (error: any) {
        return handleApiError(error);
    }
};

export const joinMeeting = async (roomName: string): Promise<ApiResponse<JoinMeetingResponse>> => {
    try {
        const res = await instanceCommunication.post(API_ENDPOINT.MEETING.JOIN, {
            room_name: roomName,
        });
        return handleApiResponse(res);
    } catch (error: any) {
        return handleApiError(error);
    }
};
