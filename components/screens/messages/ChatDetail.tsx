import { useSocket } from "@/hooks/useSocket";
import { getConversationDetail, Message, uploadFile } from "@/services/conversation.service";
import { useAuthStore } from "@/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { Audio, ResizeMode, Video } from 'expo-av';
import * as DocumentPicker from "expo-document-picker";
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [headerInfo, setHeaderInfo] = useState<{ name: string; avatar: string }>({ name: "Chat", avatar: "" });
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [playingAudioId, setPlayingAudioId] = useState<string | number | null>(null);
    const soundRef = useRef<Audio.Sound | null>(null);
    const { user } = useAuthStore();
    const { socket } = useSocket();

    // 1. Fetch data ban đầu
    useEffect(() => {
        const fetchConversation = async () => {
            if (!id) return;
            const res = await getConversationDetail(id);
            if (!res.isError && res.data) {
                const convo = res.data;
                setHeaderInfo({
                    name: convo.name || "Chat",
                    avatar: convo.avatar || `https://ui-avatars.com/api/?name=${convo.name || "Chat"}&background=random`
                });

                if (convo.messages) {
                    setMessages([...convo.messages]);
                }
            }
        };
        fetchConversation();
    }, [id]);

    useEffect(() => {
        if (!socket) return;

        const handleSocketMessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                if (Number(data.conversation_id) === Number(id)) {
                    setMessages(prev => {
                        const isMyEcho = data.sender_id === user?.id && data.temp_id;
                        const existingIndex = isMyEcho ? prev.findIndex(m => m.temp_id === data.temp_id) : -1;

                        if (existingIndex !== -1) {
                            const updatedMessages = [...prev];
                            updatedMessages[existingIndex] = { ...data, is_pending: false };
                            return updatedMessages;
                        }

                        return [data, ...prev];
                    });
                }
            } catch (error) {
                console.error("Error parsing socket message:", error);
            }
        };

        socket.addEventListener("message", handleSocketMessage);
        return () => socket.removeEventListener("message", handleSocketMessage);
    }, [socket, id, user?.id]);

    const handleSendMessage = () => {
        if (!inputMessage.trim() || !socket || !id || !user?.id) return;

        const tempId = Date.now().toString();
        const content = inputMessage.trim();

        const outgoingMessage = {
            temp_id: tempId,
            conversation_id: Number(id),
            content: content,
            type: "text",
            sender_id: user.id
        };

        const tempMsg: Message = {
            temp_id: tempId,
            content: content,
            sender_id: user.id,
            conversation_id: Number(id),
            type: "text",
            created_at: new Date().toISOString(),
            is_pending: true,
        };

        setMessages(prev => [tempMsg, ...prev]);
        socket.send(JSON.stringify(outgoingMessage));
        setInputMessage("");
    };

    const handlePickMedia = async () => {
        if (!socket || !id || !user?.id) return;

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images', 'videos'],
                quality: 1,
            });

            if (result.canceled) return;

            const asset = result.assets[0];
            const tempId = `media-${Date.now()}`;
            setIsUploading(true);

            const tempMsg: Message = {
                temp_id: tempId,
                conversation_id: Number(id),
                sender_id: user.id,
                content: "",
                type: "file",
                file_name: asset.fileName || (asset.type === 'video' ? 'video.mp4' : 'image.jpg'),
                file_type: asset.mimeType || (asset.type === 'video' ? 'video/mp4' : 'image/jpeg'),
                created_at: new Date().toISOString(),
                is_pending: true,
            };
            setMessages(prev => [tempMsg, ...prev]);

            const uploadRes = await uploadFile(asset.uri, tempMsg.file_name!, tempMsg.file_type!);
            if (!uploadRes.isError && uploadRes.data?.data) {
                const fileData = uploadRes.data.data;
                const outgoingFileMessage = {
                    temp_id: tempId,
                    conversation_id: Number(id),
                    sender_id: user.id,
                    type: "file",
                    content: "",
                    file_path: fileData.file_id,
                    file_name: fileData.file_name,
                    file_type: fileData.file_type,
                    file_size: fileData.file_size
                };

                socket.send(JSON.stringify(outgoingFileMessage));
            } else {
                setMessages(prev => prev.filter(m => m.temp_id !== tempId));
            }
        } catch (error) {
            console.error("Pick media error:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handlePlayAudio = async (msg: Message) => {
        const audioUrl = msg.file_url || msg.file_path;
        if (!audioUrl) return;

        try {
            // Stop current sound if playing
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
                soundRef.current = null;
                if (playingAudioId === (msg.id || msg.temp_id)) {
                    setPlayingAudioId(null);
                    return;
                }
            }

            setPlayingAudioId(msg.id || msg.temp_id || null);
            const { sound } = await Audio.Sound.createAsync(
                { uri: audioUrl },
                { shouldPlay: true }
            );
            soundRef.current = sound;

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    setPlayingAudioId(null);
                    sound.unloadAsync();
                    soundRef.current = null;
                }
            });
        } catch (error) {
            console.error("Play audio error:", error);
            setPlayingAudioId(null);
        }
    };

    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    const handlePickDocument = async () => {
        if (!socket || !id || !user?.id) return;

        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const asset = result.assets[0];
            const tempId = `file-${Date.now()}`;
            setIsUploading(true);

            const tempMsg: Message = {
                temp_id: tempId,
                conversation_id: Number(id),
                sender_id: user.id,
                content: "",
                type: "file",
                file_name: asset.name,
                file_type: asset.mimeType || "application/octet-stream",
                created_at: new Date().toISOString(),
                is_pending: true,
            };
            setMessages(prev => [tempMsg, ...prev]);

            const uploadRes = await uploadFile(asset.uri, asset.name, asset.mimeType || "application/octet-stream");
            console.log("uploadRes: ", uploadRes);
            if (!uploadRes.isError && uploadRes.data?.data) {
                const fileData = uploadRes.data.data;
                const outgoingFileMessage = {
                    temp_id: tempId,
                    conversation_id: Number(id),
                    sender_id: user.id,
                    type: "file",
                    content: "",
                    file_path: fileData.file_id, // Chính là object key trong MinIO
                    file_name: fileData.file_name,
                    file_type: fileData.file_type,
                    file_size: fileData.file_size
                };

                socket.send(JSON.stringify(outgoingFileMessage));
            } else {
                setMessages(prev => prev.filter(m => m.temp_id !== tempId));
                console.error("Upload failed");
            }
        } catch (error: any) {
            console.error("Pick document error:", error);
            console.error("Pick document error detail:", error?.message);
            if (error.response) {
                console.error("Data:", error.response.data);
                console.error("Status:", error.response.status);
            }
        } finally {
            setIsUploading(false);
        }
    };

    const renderItem = ({ item }: { item: Message }) => {
        const isMine = item.sender_id === user?.id;
        const isImage = item.type === "file" && item.file_type?.startsWith("image/");
        const isVideo = item.type === "file" && item.file_type?.startsWith("video/");
        const isAudio = item.type === "file" && item.file_type?.startsWith("audio/");
        const mediaSource = item.file_url || item.file_path;
        return (
            <View className={`mb-3 max-w-[85%] rounded-2xl px-3 py-2 ${isMine ? "self-end bg-[#8862F2]" : "self-start bg-white shadow-sm"}`}>
                {/* Text Content */}
                {item.type === "text" && (
                    <Text className={`text-[15px] ${isMine ? "text-white" : "text-[#1A1C1E]"}`}>{item.content}</Text>
                )}

                {/* Image Content */}
                {isImage && (
                    <View className="w-64 h-48 rounded-xl overflow-hidden mb-1 bg-gray-200">
                        <Image
                            source={{ uri: mediaSource }}
                            style={{ width: "100%", height: "100%" }}
                            contentFit="cover"
                        />
                        {item.is_pending && (
                            <View className="absolute inset-0 items-center justify-center bg-black/20">
                                <ActivityIndicator color="white" />
                            </View>
                        )}
                    </View>
                )}

                {/* Video Content */}
                {isVideo && (
                    <View className="w-64 h-48 rounded-xl overflow-hidden mb-1 bg-black">
                        <Video
                            source={{ uri: mediaSource as string }}
                            style={{ width: "100%", height: "100%" }}
                            useNativeControls
                            resizeMode={ResizeMode.CONTAIN}
                            isLooping={false}
                        />
                        {item.is_pending && (
                            <View className="absolute inset-0 items-center justify-center bg-black/40">
                                <ActivityIndicator color="white" />
                            </View>
                        )}
                    </View>
                )}

                {/* Audio Content */}
                {isAudio && (
                    <View className={`w-64 p-3 rounded-xl mb-1 ${isMine ? "bg-white/20" : "bg-gray-100"}`}>
                        <View className="flex-row items-center">
                            <TouchableOpacity onPress={() => handlePlayAudio(item)}>
                                <Ionicons
                                    name={playingAudioId === (item.id || item.temp_id) ? "pause-circle" : "play-circle"}
                                    size={40}
                                    color={isMine ? "white" : "#8862F2"}
                                />
                            </TouchableOpacity>
                            <View className="ml-2 flex-1">
                                <Text numberOfLines={1} className={`text-xs font-medium ${isMine ? "text-white" : "text-black"}`}>
                                    {item.file_name}
                                </Text>
                                <View className="h-1 bg-gray-300 rounded-full mt-1 overflow-hidden">
                                    <View
                                        className={`h-1 bg-purple-500 rounded-full ${playingAudioId === (item.id || item.temp_id) ? "w-1/2" : "w-0"}`}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {/* File Content (PDF, Zip, etc.) */}
                {item.type === "file" && !isImage && (
                    <View className={`flex-row items-center p-2 rounded-xl ${isMine ? "bg-white/20" : "bg-gray-100"}`}>
                        <Ionicons name="document" size={28} color={isMine ? "white" : "#8862F2"} />
                        <View className="ml-2 flex-1">
                            <Text numberOfLines={1} className={`font-medium ${isMine ? "text-white" : "text-[#1A1C1E]"}`}>
                                {item.file_name}
                            </Text>
                            <Text className={`text-[10px] ${isMine ? "text-purple-200" : "text-gray-500"}`}>
                                {item.file_type?.split('/')[1]?.toUpperCase()}
                            </Text>
                        </View>
                    </View>
                )}

                <View className="flex-row justify-end items-center mt-1">
                    <Text className={`text-[10px] ${isMine ? "text-purple-200" : "text-gray-400"}`}>
                        {dayjs(item.created_at).format("HH:mm")}
                    </Text>
                    {isMine && (
                        <Ionicons
                            name={item.is_pending ? "time-outline" : "checkmark-done"}
                            size={12}
                            color="#E9D5FF"
                            style={{ marginLeft: 4 }}
                        />
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Ionicons name="chevron-back" size={28} color="#8862F2" />
                </TouchableOpacity>
                <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                        <Image source={{ uri: headerInfo.avatar }} style={{ width: "100%", height: "100%" }} />
                    </View>
                    <Text className="text-[18px] font-bold text-[#1A1C1E]" numberOfLines={1}>{headerInfo.name}</Text>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "padding"}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
            >
                <FlatList
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(item) => (item.id?.toString() || item.temp_id || Math.random().toString())}
                    className="flex-1 bg-[#F8F9FB]"
                    contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }}
                    inverted
                    showsVerticalScrollIndicator={false}
                />

                {/* Input Area */}
                <View className="px-4 py-3 bg-white border-t border-gray-100">
                    <View className="flex-row items-end bg-gray-50 rounded-3xl px-4 py-2 border border-gray-200">
                        <TouchableOpacity
                            className="mb-1 mr-2"
                            onPress={handlePickMedia}
                            disabled={isUploading}
                        >
                            <Ionicons name="image" size={30} color={isUploading ? "#9CA3AF" : "#8862F2"} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="mb-1 mr-2"
                            onPress={handlePickDocument}
                            disabled={isUploading}
                        >
                            <Ionicons name="add-circle" size={32} color={isUploading ? "#9CA3AF" : "#8862F2"} />
                        </TouchableOpacity>

                        <TextInput
                            className="flex-1 py-2 text-[16px] text-[#1A1C1E] max-h-32"
                            placeholder="Aa"
                            multiline
                            value={inputMessage}
                            onChangeText={setInputMessage}
                        />

                        {(inputMessage.trim().length > 0) && (
                            <TouchableOpacity className="mb-1 ml-2" onPress={handleSendMessage}>
                                <View className="bg-[#8862F2] rounded-full p-2">
                                    <Ionicons name="send" size={18} color="white" />
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}