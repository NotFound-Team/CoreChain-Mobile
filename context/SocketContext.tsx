import { useAuthStore } from "@/stores/auth-store";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface SocketContextType {
    socket: WebSocket | null;
    isConnected: boolean;
    connect: () => Promise<void>;
    disconnect: () => void;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    connect: async () => { },
    disconnect: () => { },
});

export const useSocketContext = () => useContext(SocketContext);

const RECONNECT_INTERVALS = [1000, 2000, 5000, 10000, 30000]; // ms
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, token } = useAuthStore();
    const accessToken = token?.accessToken;

    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<any>(null);
    const reconnectCountRef = useRef(0);

    const connect = React.useCallback(async () => {
        if (socketRef.current?.readyState === WebSocket.OPEN ||
            socketRef.current?.readyState === WebSocket.CONNECTING) {
            return;
        }

        if (!accessToken || !isAuthenticated) {
            return;
        }

        console.log("WebSocket: Starting connection attempt...");

        const wsUrl = `${process.env.EXPO_PUBLIC_WS_URL}/ws?token=${accessToken}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log("WebSocket connected ✅");
            setIsConnected(true);
            reconnectCountRef.current = 0;
        };

        ws.onmessage = (event) => {
            console.log("WebSocket message:", event.data);
        };

        ws.onclose = (e) => {
            console.log("WebSocket closed", e.code, e.reason);
            setIsConnected(false);
            socketRef.current = null;
            setSocket(null);

            if (isAuthenticated && e.code !== 1000) {
                const delay = RECONNECT_INTERVALS[Math.min(reconnectCountRef.current, RECONNECT_INTERVALS.length - 1)];
                reconnectTimeoutRef.current = setTimeout(() => {
                    reconnectCountRef.current += 1;
                    connect();
                }, delay);
            }
        };

        ws.onerror = (e) => {
            console.error("WebSocket Error Object:", JSON.stringify(e));
        };

        socketRef.current = ws;
        setSocket(ws);
    }, [isAuthenticated, accessToken]);

    const disconnect = React.useCallback(() => {
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        if (socketRef.current) {
            socketRef.current.close(1000, "Normal Closure");
            socketRef.current = null;
        }
        setSocket(null);
        setIsConnected(false);
    }, []);

    useEffect(() => {
        if (isAuthenticated && accessToken) {
            connect();
        } else {
            disconnect();
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        }
    }, [isAuthenticated, accessToken]);

    return (
        <SocketContext.Provider value={{ socket, isConnected, connect, disconnect }}>
            {children}
        </SocketContext.Provider>
    );
};