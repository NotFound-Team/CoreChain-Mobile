import { createMeeting, CreateMeetingDto, getMeetings, joinMeeting, Meeting } from "@/services/meeting.service";
import { useAuthStore } from "@/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CreateMeetingModal from "./CreateMeetingModal";

export default function MeetingScreen() {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isJoining, setIsJoining] = useState<number | null>(null);

    const user = useAuthStore((state) => state.user);
    const canCreateMeeting = user?.roleName === "MANAGER" || user?.roleName === "ADMIN";

    const fetchMeetings = async () => {
        try {
            const response = await getMeetings();
            if (!response.isError && response.data) {
                setMeetings(response.data);
            }
        } catch (error) {
            console.error("Error fetching meetings:", error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, []);

    const onRefresh = () => {
        setIsRefreshing(true);
        fetchMeetings();
    };

    const handleCreateMeeting = async (data: CreateMeetingDto) => {
        try {
            const response = await createMeeting(data);
            if (!response.isError) {
                fetchMeetings();
            }
        } catch (error) {
            console.error("Error creating meeting:", error);
        }
    };

    const handleJoinMeet = async (item: Meeting) => {
        setIsJoining(item.id);
        try {
            const response = await joinMeeting(item.room_name);
            if (!response.isError && response.data) {
                const { token, room_name, server_url } = response.data;
                router.push({
                    pathname: "/video-meeting",
                    params: { token, roomName: room_name, url: server_url },
                });
            }
        } catch (error) {
            console.error("Error joining meeting:", error);
        } finally {
            setIsJoining(null);
        }
    };

    const renderMeetingItem = ({ item }: { item: Meeting }) => (
        <View className="bg-white border border-gray-100 rounded-2xl p-4 mb-3 flex-row items-center justify-between shadow-sm">
            <View className="flex-row items-center flex-1">
                <View className="bg-[#8862F2] p-2 rounded-full mr-3">
                    <Ionicons name="videocam" size={20} color="white" />
                </View>
                <View className="flex-1">
                    <Text className="font-bold text-[#1A1C1E] text-[15px]">
                        {item.title}
                    </Text>
                    <View className="flex-row items-center mt-1">
                        <Ionicons name="time-outline" size={14} color="#9AA0A6" />
                        <Text className="text-gray-400 text-xs ml-1">
                            {new Date(item.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity
                className="bg-[#8862F2] px-4 py-2 rounded-full flex-row items-center"
                onPress={() => handleJoinMeet(item)}
                disabled={isJoining === item.id}
            >
                {isJoining === item.id ? (
                    <ActivityIndicator size="small" color="white" className="mr-2" />
                ) : null}
                <Text className="text-white font-medium text-xs">Join Meet</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FE]">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 pt-8 bg-white border-b border-b-gray-200">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center rounded-full bg-[#F3F0FF]"
                >
                    <Ionicons name="chevron-back" size={24} color="#8862F2" />
                </TouchableOpacity>

                <Text className="text-[18px] font-bold text-[#1A1C1E]">Meetings</Text>

                {canCreateMeeting ? (
                    <TouchableOpacity
                        className="w-10 h-10 items-center justify-center rounded-full bg-[#8862F2]"
                        onPress={() => setIsModalVisible(true)}
                    >
                        <Ionicons name="add" size={24} color="white" />
                    </TouchableOpacity>
                ) : (
                    <View className="w-10" />
                )}
            </View>

            {isLoading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#8862F2" />
                </View>
            ) : (
                <FlatList
                    data={meetings}
                    renderItem={renderMeetingItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            tintColor="#8862F2"
                        />
                    }
                    ListEmptyComponent={
                        <View className="mt-10 items-center">
                            <Text className="text-gray-400">No meetings found</Text>
                        </View>
                    }
                />
            )}

            <CreateMeetingModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onCreate={handleCreateMeeting}
            />
        </SafeAreaView>
    );
}
