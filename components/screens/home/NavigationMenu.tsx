import { BottomSheet } from "@/components/BottomSheet";
import { MENU_ITEMS } from "@/constants/menu-navigate";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React from "react";
import {
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface NavigationMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function NavigationMenu({
  visible,
  onClose,
}: NavigationMenuProps) {
  const router = useRouter();

  const handleNavigate = (href: Href) => {
    onClose();
    router.push(href);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <BottomSheet.Overlay />
      {/* HEADER SLOT */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <BottomSheet.Content heightPercentage={0.46}>
          <View className="flex-row items-center justify-between mb-8">
            <Text className="text-2xl font-bold text-gray-900">
              Quick Access
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
            >
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row flex-wrap">
              {MENU_ITEMS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className="w-[25%] items-center mb-6"
                  onPress={() => handleNavigate(item.href)}
                >
                  <View
                    className="w-14 h-14 items-center justify-center rounded-2xl mb-2 shadow-sm"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Ionicons name={item.icon} size={26} color={item.color} />
                  </View>
                  <Text
                    className="text-[11px] font-bold text-gray-600 text-center"
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </BottomSheet.Content>
      </TouchableWithoutFeedback>
    </BottomSheet>
  );
}
