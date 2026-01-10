import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Reusing Mock Data for display purposes (in real app would fetch by ID)
const MOCK_USERS_MAP: Record<string, { name: string; avatar: string }> = {
    "1": { name: "Alicia Rochefort", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alicia" },
    "2": { name: "Jessica Tan", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica" },
    "3": { name: "Lolita Xue", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lolita" },
    "4": { name: "Eaj Prakk", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eaj" },
    "5": { name: "Jason", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jason" },
};

export default function ChatDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const user = id ? MOCK_USERS_MAP[id] : null;

    return (
        <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mr-3"
                >
                    <Ionicons name="chevron-back" size={28} color="#8862F2" />
                </TouchableOpacity>

                {user && (
                    <View className="flex-row items-center flex-1">
                        <View className="w-9 h-9 rounded-full overflow-hidden bg-[#FDE7E7] mr-3">
                            <Image
                                source={{ uri: user.avatar }}
                                style={{ width: "100%", height: "100%" }}
                                contentFit="cover"
                            />
                        </View>
                        <Text className="text-[18px] font-bold text-[#1A1C1E] flex-1" numberOfLines={1}>
                            {user.name}
                        </Text>
                    </View>
                )}
            </View>

            {/* Chat Area - Placeholder */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1 bg-[#F1F3F8] px-4 py-4"
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Text className="text-gray-400">Start your conversation with {user?.name}</Text>
                </ScrollView>

                {/* Input Area */}
                <View className="p-4 bg-white border-t border-gray-200">
                    <View className="flex-row items-center bg-gray-100 rounded-full px-4 min-h-[44px]">
                        <TextInput
                            className="flex-1 py-3 text-[#1A1C1E]"
                            placeholder="Type a message..."
                            multiline
                        />
                        <TouchableOpacity className="ml-2">
                            <Ionicons name="send" size={20} color="#8862F2" />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
