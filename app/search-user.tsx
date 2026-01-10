import SearchUser from "@/components/screens/messages/SearchUser";
import { Stack } from "expo-router";

export default function SearchUserRoute() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SearchUser />
        </>
    );
}
