import { useSocketContext } from "@/context/SocketContext";
import { useEffect } from "react";

export const useSocket = () => {
    const context = useSocketContext();

    useEffect(() => {
        if (!context.isConnected && !context.socket) {
            context.connect();
        }
    }, [context.isConnected, context.socket]);

    return context;
};
