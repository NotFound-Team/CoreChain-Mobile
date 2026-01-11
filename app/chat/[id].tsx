import ChatDetail from "@/components/screens/messages/ChatDetail";
import { Stack } from "expo-router";

export default function ChatDetailRoute() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ChatDetail />
        </>
    );
}
