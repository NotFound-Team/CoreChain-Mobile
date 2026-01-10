import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock Data
const MOCK_USERS = [
    {
        id: "1",
        name: "Alicia Rochefort",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alicia",
    },
    {
        id: "2",
        name: "Jessica Tan",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    },
    {
        id: "3",
        name: "Lolita Xue",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lolita",
    },
    {
        id: "4",
        name: "Eaj Prakk",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eaj",
    },
    {
        id: "5",
        name: "Jason",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jason",
    },
];

// Simple debounce hook implementation
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function SearchUser() {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 500);
    const [results, setResults] = useState<typeof MOCK_USERS>([]);

    // Effect to handle search
    React.useEffect(() => {
        if (!debouncedQuery) {
            setResults([]);
            return;
        }

        // Simulate API call with mock data
        const filtered = MOCK_USERS.filter((user) =>
            user.name.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
        setResults(filtered);
    }, [debouncedQuery]);

    const handleUserPress = (userId: string) => {
        router.push(`/chat/${userId}`);
    };

    const renderItem = ({ item }: { item: (typeof MOCK_USERS)[0] }) => (
        <TouchableOpacity
            className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100"
            onPress={() => handleUserPress(item.id)}
        >
            <View className="w-10 h-10 rounded-full overflow-hidden bg-[#FDE7E7]">
                <Image
                    source={{ uri: item.avatar }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                />
            </View>
            <Text className="ml-3 text-[#1A1C1E] font-medium text-[16px]">
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header with Search Input */}
            <View className="flex-row items-center px-4 py-2 border-b border-gray-200 gap-3">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#1A1C1E" />
                </TouchableOpacity>

                <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 h-14">
                    <Ionicons name="search" size={20} color="#6B7280" />
                    <TextInput
                        className="flex-1 ml-2 text-[#1A1C1E] text-[16px]"
                        placeholder="Search users..."
                        placeholderTextColor="#9CA3AF"
                        value={query}
                        onChangeText={setQuery}
                        autoFocus
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery("")}>
                            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Results */}
            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={
                    debouncedQuery ? (
                        <View className="p-8 items-center">
                            <Text className="text-gray-500">No users found</Text>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}
