import { searchUsers } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Modal from "react-native-modal";

interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface CreateMeetingModalProps {
    isVisible: boolean;
    onClose: () => void;
    onCreate: (data: {
        title: string;
        description: string;
        invited_user_ids: string[];
        start_time?: string;
    }) => void;
}

export default function CreateMeetingModal({
    isVisible,
    onClose,
    onCreate,
}: CreateMeetingModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [isPlanning, setIsPlanning] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<"date" | "time">("date");

    const currentUser = useAuthStore((state) => state.user);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsLoadingUsers(true);
        try {
            const response = await searchUsers(query);
            if (!response.isError && response.data) {
                const filtered = response.data.result?.filter(
                    (u: any) => u._id !== currentUser?.id
                ) || [];
                setSearchResults(filtered);
            }
        } catch (error) {
            console.error("Error searching users:", error);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const toggleUser = (user: User) => {
        const isSelected = selectedUsers.find((u) => u._id === user._id);
        if (isSelected) {
            setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const onPickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (Platform.OS === "android") {
            setShowPicker(false);
        }

        if (selectedDate) {
            if (pickerMode === "date") {
                const newDate = new Date(selectedDate);
                newDate.setHours(startDate.getHours());
                newDate.setMinutes(startDate.getMinutes());
                setStartDate(newDate);
                if (Platform.OS === "android") {
                    // Automatically open time picker after date picker on Android
                    setTimeout(() => {
                        setPickerMode("time");
                        setShowPicker(true);
                    }, 100);
                }
            } else {
                setStartDate(selectedDate);
            }
        }
    };

    const handleCreate = () => {
        if (!title.trim()) return;

        onCreate({
            title,
            description,
            invited_user_ids: selectedUsers.map((u) => u._id),
            start_time: isPlanning ? startDate.toISOString() : undefined,
        });

        // Reset and close
        setTitle("");
        setDescription("");
        setSearchQuery("");
        setSelectedUsers([]);
        setIsPlanning(false);
        setStartDate(new Date());
        onClose();
    };

    const showDatepicker = () => {
        setPickerMode("date");
        setShowPicker(true);
    };

    const showTimepicker = () => {
        setPickerMode("time");
        setShowPicker(true);
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            style={{ margin: 0, justifyContent: "flex-end" }}
            avoidKeyboard
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="bg-white rounded-t-[30px] p-6 max-h-[90%]"
            >
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-xl font-bold text-[#1A1C1E]">
                        Create New Meeting
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color="#1A1C1E" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-600 mb-2">
                            Meeting Title *
                        </Text>
                        <TextInput
                            className="bg-gray-50 p-4 rounded-xl border border-gray-100"
                            placeholder="Enter meeting title"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-600 mb-2">
                            Description (Optional)
                        </Text>
                        <TextInput
                            className="bg-gray-50 p-4 rounded-xl border border-gray-100"
                            placeholder="Enter description"
                            multiline
                            numberOfLines={3}
                            value={description}
                            onChangeText={setDescription}
                            textAlignVertical="top"
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-600 mb-2">
                            Invite People
                        </Text>
                        <View className="flex-row items-center bg-gray-50 px-4 rounded-xl border border-gray-100">
                            <Ionicons name="search" size={20} color="#9AA0A6" />
                            <TextInput
                                className="flex-1 p-4"
                                placeholder="Search by name"
                                value={searchQuery}
                                onChangeText={handleSearch}
                            />
                            {isLoadingUsers && <ActivityIndicator size="small" color="#8862F2" />}
                        </View>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <View className="bg-white border border-gray-100 rounded-xl mt-2 max-h-40 overflow-hidden shadow-sm">
                                <ScrollView nestedScrollEnabled>
                                    {searchResults.map((user) => (
                                        <TouchableOpacity
                                            key={user._id}
                                            className="p-3 border-b border-gray-50 flex-row items-center justify-between"
                                            onPress={() => toggleUser(user)}
                                        >
                                            <Text className="text-gray-700">{user.name}</Text>
                                            {selectedUsers.find((u) => u._id === user._id) && (
                                                <Ionicons name="checkmark-circle" size={20} color="#8862F2" />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        {/* Selected Users */}
                        {selectedUsers.length > 0 && (
                            <View className="flex-row flex-wrap mt-2">
                                {selectedUsers.map((user) => (
                                    <TouchableOpacity
                                        key={user._id}
                                        onPress={() => toggleUser(user)}
                                        className="bg-[#F3F0FF] px-3 py-1.5 rounded-full mr-2 mb-2 flex-row items-center"
                                    >
                                        <Text className="text-[#8862F2] text-xs mr-1">
                                            {user.name}
                                        </Text>
                                        <Ionicons name="close-circle" size={14} color="#8862F2" />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    <View className="mb-6">
                        <TouchableOpacity
                            className="flex-row items-center mb-4"
                            onPress={() => setIsPlanning(!isPlanning)}
                        >
                            <Ionicons
                                name={isPlanning ? "checkbox" : "square-outline"}
                                size={24}
                                color="#8862F2"
                            />
                            <Text className="ml-2 text-gray-600 font-medium">
                                Plan this meeting (set start time)
                            </Text>
                        </TouchableOpacity>

                        {isPlanning && (
                            <View className="flex-row justify-between">
                                <TouchableOpacity
                                    onPress={showDatepicker}
                                    className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex-1 mr-2 flex-row items-center justify-between"
                                >
                                    <Text className="text-gray-700">
                                        {startDate.toLocaleDateString()}
                                    </Text>
                                    <Ionicons name="calendar-outline" size={20} color="#8862F2" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={showTimepicker}
                                    className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex-1 ml-2 flex-row items-center justify-between"
                                >
                                    <Text className="text-gray-700">
                                        {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                    <Ionicons name="time-outline" size={20} color="#8862F2" />
                                </TouchableOpacity>
                            </View>
                        )}

                        {showPicker && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={startDate}
                                mode={pickerMode}
                                is24Hour={true}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={onPickerChange}
                            />
                        )}
                    </View>

                    <TouchableOpacity
                        className={`p-4 rounded-xl items-center mb-8 ${!title.trim() ? "bg-gray-300" : "bg-[#8862F2]"
                            }`}
                        disabled={!title.trim()}
                        onPress={handleCreate}
                    >
                        <Text className="text-white font-bold text-lg">
                            Create Meeting
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}
