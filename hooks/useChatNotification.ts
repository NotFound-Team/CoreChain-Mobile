import { useSocketContext } from "@/context/SocketContext";
import { useAuthStore } from "@/stores/auth-store";
import { usePathname, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

interface NotificationData {
    visible: boolean;
    title: string;
    message: string;
    onPress?: () => void;
}

export const useChatNotification = (setNotification: (data: NotificationData) => void) => {
    const { onMessage, offMessage } = useSocketContext();
    const { user } = useAuthStore();
    const segments = useSegments();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleNewMessage = (data: any) => {
            console.log("useChatNotification received message:", data);

            // Skip non-message types like mark_as_read
            if (data.type === "mark_as_read") return;

            // Skip notification if it's our own message
            if (data.sender_id && user?.id && String(data.sender_id) === String(user.id)) {
                console.log("Skipping notification for self-sent message");
                return;
            }

            console.log("Current segments:", segments);

            if (data && data.conversation_id) {
                const conversationId = data.conversation_id.toString();

                // Only suppress if looking at the SPECIFIC chat
                const isOnChatScreen = pathname.includes(`/chat/${conversationId}`);

                console.log(`Pathname: ${pathname}, TargetConvoId: ${conversationId}, Is on chat screen? ${isOnChatScreen}`);

                if (!isOnChatScreen) {
                    const notificationMessage = data.type === 'file'
                        ? `you received a file${data.file_name ? `: ${data.file_name}` : ''}`
                        : (data.content || "You have a new message");

                    setNotification({
                        visible: true,
                        title: data.sender_name || "New Message",
                        message: notificationMessage,
                        onPress: () => {
                            router.push({
                                pathname: `/chat/${conversationId}`,
                                params: {
                                    fromNotification: 'true',
                                    messageData: JSON.stringify(data)
                                }
                            } as any);
                        }
                    });

                    setTimeout(() => {
                        setNotification({
                            visible: false,
                            title: "",
                            message: "",
                        });
                    }, 5000);
                }
            }
        };

        onMessage(handleNewMessage);
        return () => offMessage(handleNewMessage);
    }, [segments, pathname, onMessage, offMessage, router, setNotification, user]);
};
