import { useSocket } from "@/hooks/useSocket";
import { getConversationDetail, getConversationMessages, Message, uploadFile } from "@/services/conversation.service";
import { useAuthStore } from "@/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { Audio, ResizeMode, Video } from 'expo-av';
import * as DocumentPicker from "expo-document-picker";
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
    const { id, fromNotification, messageData } = useLocalSearchParams<{ id: string; fromNotification?: string; messageData?: string }>();
    const [headerInfo, setHeaderInfo] = useState<{ name: string; avatar: string }>({ name: "Chat", avatar: "" });
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [playingAudioId, setPlayingAudioId] = useState<string | number | null>(null);
    const soundRef = useRef<Audio.Sound | null>(null);
    const lastTrackedReadId = useRef<number | null>(null);
    const { user } = useAuthStore();
    const { socket, onMessage, offMessage } = useSocket();

    const normalizeMessage = useCallback((msg: Message): Message => {
        const newMsg = { ...msg };
        if (!newMsg.created_at || newMsg.created_at.startsWith("0001-01-01")) {
            newMsg.created_at = new Date().toISOString();
        }
        return newMsg;
    }, []);

    const markAsRead = useCallback((lastMessageId: number) => {
        if (!socket || !id || !user?.id) return;
        if (lastTrackedReadId.current && lastMessageId <= lastTrackedReadId.current) return;

        console.log(`Sending mark_as_read for convo ${id}, msg ${lastMessageId}`);
        socket.send(JSON.stringify({
            type: "mark_as_read",
            conversation_id: Number(id),
            sender_id: user.id,
            last_read_message_id: lastMessageId
        }));
        lastTrackedReadId.current = lastMessageId;
    }, [socket, id, user?.id]);

    // Automatically mark newest confirmed messages as read
    useEffect(() => {
        const newestWithId = messages.find(m => m.id);
        if (newestWithId && newestWithId.id) {
            markAsRead(newestWithId.id);
        }
    }, [messages, markAsRead]);

    const mergeMessages = useCallback((newMessages: Message[]) => {
        setMessages(prev => {
            const messageMap = new Map<string, Message>();

            prev.forEach(m => {
                const msg = normalizeMessage(m);
                if (msg.client_msg_id) {
                    messageMap.set(msg.client_msg_id, msg);
                } else if (msg.id) {
                    messageMap.set(`id-${msg.id}`, msg);
                }
            });

            newMessages.forEach(m => {
                const msg = normalizeMessage(m);
                msg.is_pending = false;

                const key = msg.client_msg_id || (msg.id ? `id-${msg.id}` : null);
                if (!key) return;

                if (messageMap.has(key)) {
                    const existing = messageMap.get(key)!;
                    if (!existing.id && msg.id) {
                        messageMap.set(key, { ...existing, ...msg, is_pending: false });
                    } else if (existing.id && !msg.id) {
                    } else {
                        messageMap.set(key, { ...existing, ...msg, is_pending: false });
                    }
                } else {
                    messageMap.set(key, msg);
                }
            });

            const merged = Array.from(messageMap.values());
            return merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        });
    }, [normalizeMessage]);

    const fetchConversation = useCallback(async (isRetry = false, retryCount = 0) => {
        if (!id) return;
        const retryDelays = [1500, 1200, 1000];
        const maxRetries = 3;

        console.log(`${isRetry ? "Retrying" : "Fetching"} conversation detail for id:`, id, "attempt:", retryCount + 1);

        const res = await getConversationDetail(id);
        if (!res.isError && res.data) {
            const convo = res.data;
            setHeaderInfo({
                name: convo.name || "Chat",
                avatar: convo.avatar || `https://ui-avatars.com/api/?name=${convo.name || "Chat"}&background=random`
            });

            if (convo.messages) {
                console.log(`Fetched ${convo.messages.length} messages`);
                mergeMessages(convo.messages);
            }

            // Mark as read immediately when visiting
            if (convo.last_message_id) {
                markAsRead(convo.last_message_id);
            }

            const hasMessagesWithoutId = convo.messages?.some((m: Message) => !m.id) || false;
            console.log("Has messages without ID:", hasMessagesWithoutId);

            if (fromNotification === "true" && hasMessagesWithoutId && retryCount < maxRetries) {
                setTimeout(() => {
                    fetchConversation(true, retryCount + 1);
                }, retryDelays[retryCount]);
            }
        }
    }, [id, fromNotification, mergeMessages, markAsRead]);

    const handleLoadMore = useCallback(async () => {
        if (isLoadingMore || !hasMore || !id) return;

        // Find the oldest message with an ID
        const oldestMessage = [...messages].reverse().find(m => m.id);
        if (!oldestMessage || !oldestMessage.id) return;

        setIsLoadingMore(true);
        console.log("Loading more messages before ID:", oldestMessage.id);

        try {
            const res = await getConversationMessages(Number(id), oldestMessage.id);
            if (!res.isError && res.data) {
                console.log(`Fetched ${res.data.length} older messages`);
                if (res.data.length > 0) {
                    mergeMessages(res.data);
                }

                if (res.data.length < 20) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Load more error:", error);
            setHasMore(false);
        } finally {
            setIsLoadingMore(false);
        }
    }, [messages, id, isLoadingMore, hasMore, mergeMessages]);

    useEffect(() => {
        if (fromNotification === "true" && messageData) {
            try {
                const notificationMsg = JSON.parse(messageData);
                console.log("Adding notification message immediately:", notificationMsg);
                mergeMessages([notificationMsg]);
            } catch (e) {
                console.error("Failed to parse messageData", e);
            }
        }

        fetchConversation();

        const syncTimeout = setTimeout(() => {
            console.log("Performing final background sync...");
            fetchConversation(true);
        }, 3000);

        return () => clearTimeout(syncTimeout);
    }, [id, fromNotification, messageData, fetchConversation, mergeMessages]);

    useEffect(() => {
        const handleSocketMessage = (data: any) => {
            console.log("ChatDetail received socket message:", data);

            // Skip non-message types like mark_as_read
            if (data.type === "mark_as_read") return;

            if (Number(data.conversation_id) === Number(id)) {
                setMessages(prev => {
                    const msg = normalizeMessage(data);
                    msg.is_pending = false;

                    const isMyEcho = msg.sender_id && user?.id && String(msg.sender_id) === String(user.id) && msg.client_msg_id;
                    const existingTempIndex = isMyEcho ? prev.findIndex(m => String(m.client_msg_id) === String(msg.client_msg_id)) : -1;

                    if (existingTempIndex !== -1) {
                        console.log("Resolving pending message:", msg.client_msg_id);
                        const updatedMessages = [...prev];
                        updatedMessages[existingTempIndex] = {
                            ...prev[existingTempIndex],
                            ...msg,
                            is_pending: false,
                        };
                        return updatedMessages;
                    }

                    if (msg.id && prev.some(m => m.id === msg.id)) {
                        console.log("Duplicate message ignored (id):", msg.id);
                        return prev;
                    }

                    // Mark as read immediately if it's a new message from someone else
                    // (But we send it for our own echoes too to keep it simple, it's safe)
                    if (msg.id) {
                        markAsRead(msg.id);
                    }

                    return [msg, ...prev];
                });
            }
        };

        onMessage(handleSocketMessage);
        return () => offMessage(handleSocketMessage);
    }, [onMessage, offMessage, id, user?.id, normalizeMessage]);

    const handleSendMessage = () => {
        if (!inputMessage.trim() || !socket || !id || !user?.id) return;

        const clientMsgId = `user-${user.id}-msg-${Date.now().toString()}`;
        const content = inputMessage.trim();

        const outgoingMessage = {
            client_msg_id: clientMsgId,
            conversation_id: Number(id),
            content: content,
            type: "text",
            sender_id: user.id,
            sender_name: user.name
        };

        const tempMsg: Message = {
            client_msg_id: clientMsgId,
            content: content,
            sender_id: user.id,
            sender_name: user.name,
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
            const clientMsgId = `media-${Date.now()}`;
            setIsUploading(true);

            const tempMsg: Message = {
                client_msg_id: clientMsgId,
                conversation_id: Number(id),
                sender_id: user.id,
                sender_name: user.name,
                content: "",
                type: "file",
                file_name: asset.fileName || (asset.type === 'video' ? 'video.mp4' : 'image.jpg'),
                file_type: asset.mimeType || (asset.type === 'video' ? 'video/mp4' : 'image/jpeg'),
                file_url: asset.uri, // Local URI for immediate preview
                created_at: new Date().toISOString(),
                is_pending: true,
            };
            setMessages(prev => [tempMsg, ...prev]);

            const uploadRes = await uploadFile(asset.uri, tempMsg.file_name!, tempMsg.file_type!);
            if (!uploadRes.isError && uploadRes.data?.data) {
                const fileData = uploadRes.data.data;
                const outgoingFileMessage = {
                    client_msg_id: clientMsgId,
                    conversation_id: Number(id),
                    sender_id: user.id,
                    sender_name: user.name,
                    type: "file",
                    content: "",
                    file_id: fileData.file_id,
                    file_path: fileData.file_id,
                    file_name: fileData.file_name,
                    file_type: fileData.file_type,
                    file_size: fileData.file_size
                };

                socket.send(JSON.stringify(outgoingFileMessage));
            } else {
                setMessages(prev => prev.filter(m => m.client_msg_id !== clientMsgId));
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
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
                soundRef.current = null;
                if (playingAudioId === (msg.id || msg.client_msg_id)) {
                    setPlayingAudioId(null);
                    return;
                }
            }

            setPlayingAudioId(msg.id || msg.client_msg_id || null);
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
            const clientMsgId = `file-${Date.now()}`;
            setIsUploading(true);

            const tempMsg: Message = {
                client_msg_id: clientMsgId,
                conversation_id: Number(id),
                sender_id: user.id,
                sender_name: user.name,
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
                    client_msg_id: clientMsgId,
                    conversation_id: Number(id),
                    sender_id: user.id,
                    sender_name: user.name,
                    type: "file",
                    content: "",
                    file_path: fileData.file_id,
                    file_name: fileData.file_name,
                    file_type: fileData.file_type,
                    file_size: fileData.file_size
                };

                socket.send(JSON.stringify(outgoingFileMessage));
            } else {
                setMessages(prev => prev.filter(m => m.client_msg_id !== clientMsgId));
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
        const isMine = item.sender_id && user?.id && String(item.sender_id) === String(user.id);
        const mediaSource = item.file_url || item.file_path;

        const isImage = item.type === "file" && item.file_type?.startsWith("image/") && !!mediaSource;
        const isVideo = item.type === "file" && item.file_type?.startsWith("video/") && !!mediaSource;
        const isAudio = item.type === "file" && item.file_type?.startsWith("audio/") && !!mediaSource;

        const isFile = item.type === "file";
        const isMediaResolved = isImage || isVideo || isAudio;
        const showAsDocument = isFile && !isMediaResolved;

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
                                    name={playingAudioId === (item.id || item.client_msg_id) ? "pause-circle" : "play-circle"}
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
                                        className={`h-1 bg-purple-500 rounded-full ${playingAudioId === (item.id || item.client_msg_id) ? "w-1/2" : "w-0"}`}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {/* File Content (PDF, Zip, etc.) or Fallback for pending media */}
                {showAsDocument && (
                    <View className="flex-row items-center">
                        <Text className={`text-[15px] ${isMine ? "text-white" : "text-[#1A1C1E]"}`}>
                            {`file: ${item.file_name || "Attachment"}`}
                        </Text>
                        {item.is_pending && (
                            <ActivityIndicator size="small" color={isMine ? "white" : "#8862F2"} className="ml-2" />
                        )}
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
                    keyExtractor={(item) => (item.id?.toString() || item.client_msg_id || Math.random().toString())}
                    className="flex-1 bg-[#F8F9FB]"
                    contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }}
                    inverted
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={isLoadingMore ? (
                        <ActivityIndicator color="#8862F2" style={{ marginVertical: 10 }} />
                    ) : null}
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