import { getAllNotifications, NotificationItem } from "@/services/notification.service";
import { useAuthStore } from "@/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import {
  useSafeAreaInsets
} from "react-native-safe-area-context";

const ICONS = [
  "notifications",
  "document-text",
  "people",
  "chatbubble-ellipses",
  "calendar",
] as const;

const COLORS = [
  "#8862F2",
  "#4CAF50",
  "#FF9800",
  "#03A9F4",
  "#E91E63",
];

const getIconAndColor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  return {
    icon: ICONS[Math.abs(hash) % ICONS.length],
    iconColor: COLORS[Math.abs(hash) % COLORS.length],
  };
};



export default function Notifications() {

  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getAllNotifications(user?.id as string);
        console.log("get on notification", res);
        
        const mappedData: NotificationItem[] = (res.data || []).map((item: NotificationItem) => {
          const { icon, iconColor } = getIconAndColor(item.id);
          return {
            ...item,
            icon,
            iconColor,
          };
        });

        setNotifications(mappedData);
      } catch (error) {
        console.log("Fetch notifications error:", error);
      }
    };

    fetchNotifications();
  }, []);

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      className="flex-row items-start px-4 py-4 bg-white border-b border-gray-100"
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View
        className="w-12 h-12 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: `${item.iconColor}15` }}
      >
        <Ionicons
          name={item.icon ?? "notifications"}
          size={24}
          color={item.iconColor ?? "#8862F2"}
        />
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-[15px] font-bold text-[#1A1C1E] flex-1 mr-2">
            {item.title}
          </Text>
          <Text className="text-gray-400 text-[12px]">
            {new Date(item.created_at).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        <Text className="text-gray-500 text-[13px] leading-5">
          {item.body}
        </Text>
      </View>
    </TouchableOpacity>
  );



  return (
    <View className="flex-1 bg-[#F1F3F8]">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 py-4 pt-8 border-b border-gray-200 bg-white"
        style={{ paddingTop: Math.max(insets.top, 20) }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-[#F3F0FF]"
        >
          <Ionicons name="chevron-back" size={24} color="#8862F2" />
        </TouchableOpacity>

        <Text className="text-[18px] font-bold text-[#1A1C1E]">
          Notifications
        </Text>

        <View className="w-10" />
      </View>

      {/* List Notifications */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View className="h-20" />} // Tạo khoảng trống dưới cùng
      />
    </View>
  );
}