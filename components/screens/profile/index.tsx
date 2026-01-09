import { useAuthStore } from "@/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const { isAuthenticated, logout, user } = useAuthStore();

  const SECTIONS = {
    CONTACT: [
      {
        icon: "mail",
        label: user?.email || "Tonald@gmail.com",
        color: "#8862F2",
      },
      { icon: "location", label: "Taman Anggrek", color: "#8862F2" },
    ],
    ACCOUNT: [
      { icon: "person", label: "Personal Data", href: "/personal" },
      { icon: "folder", label: "Office Assets" },
      { icon: "card", label: "Payroll & Tax", href: "/personnel" },
    ],
    SETTINGS: [
      { icon: "settings", label: "Change Password", href: "/changepassword" },
      { icon: "code-working", label: "Versioning" },
      { icon: "help-circle", label: "FAQ and Help" },
      // { icon: "log-out", label: "Logout", color: "#FF5A5F", isLogout: true },
    ],
  };

  const handleLogout = async () => {
    console.log("handle logout");

    if (isAuthenticated) {
      await logout();
    } else {
      router.replace("/(auth)/signin");
    }
  };
  const renderItem = (item: any, index: number) => (
    <TouchableOpacity
      key={index}
      className="flex-row items-center justify-between py-3 px-4"
      onPress={() => {
        if (item.href) {
          router.push(item.href);
        }
      }}
    >
      <View className="flex-row items-center">
        <View
          className="w-8 h-8 rounded-lg items-center justify-center mr-3"
          style={{
            backgroundColor: item.color ? `${item.color}20` : "#F3F4F6",
          }}
        >
          <Ionicons
            name={item.icon as any}
            size={18}
            color={item.color || "#8862F2"}
          />
        </View>
        <Text
          className={`text-[15px] font-medium ${item.isLogout ? "text-[#FF5A5F]" : "text-[#4B5563]"}`}
        >
          {item.label}
        </Text>
      </View>
      {!item.isLogout && (
        <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Purple Header */}
        <View className="bg-[#8862F2] pt-12 pb-24 px-5 items-center">
          <View className="flex-row w-full items-center justify-between mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-white/20 p-2 rounded-full"
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-bold">My Profile</Text>
            <View className="w-10" />
          </View>
        </View>

        {/* Profile Card Container */}
        <View className="px-5 -mt-0 bg-white rounded-tl-[20px] rounded-tr-[20px] ">
          <View className=" rounded-[30px]  pb-6 pt-1 items-center overflow-visible">
            {/* Avatar */}
            <View className="border-4 border-white rounded-[25px] -mt-16 bg-[#E8E1FF] overflow-hidden">
              <Image
                source={{
                  uri: "https://img.freepik.com/vector-mien-phi/hinh-minh-hoa-chang-trai-tre-mim-cuoi_1308-174669.jpg",
                }}
                style={{ width: 128, height: 128, borderRadius: 24 }}
                className="w-32 h-32"
                contentFit="cover"
              />
            </View>

            <View className="items-center mt-4">
              <View className="flex-row items-center">
                <Text className="text-xl font-bold text-[#1A1C1E]">
                  {user?.name || "Tonald Drump"}
                </Text>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="#8862F2"
                  className="ml-1"
                />
              </View>
              <Text className="text-[#8862F2] font-medium mt-1">
                {user?.roleName || "Product Designer"}
              </Text>
            </View>
          </View>

          {/* Sections */}
          <View className="mt-6 mb-10">
            {/* Contact Section */}
            <Text className="text-gray-500 font-bold text-xs ml-2 mb-3">
              CONTACT
            </Text>
            <View className="bg-[#F8F9FE] rounded-2xl shadow-sm mb-6 py-2">
              {SECTIONS.CONTACT.map(renderItem)}
            </View>

            {/* Account Section */}
            <Text className="text-gray-500 font-bold text-xs ml-2 mb-3">
              ACCOUNT
            </Text>
            <View className="bg-[#F8F9FE] rounded-2xl shadow-sm mb-6 py-2">
              {SECTIONS.ACCOUNT.map(renderItem)}
            </View>

            {/* Settings Section */}
            <Text className="text-gray-500 font-bold text-xs ml-2 mb-3">
              SETTINGS
            </Text>
            <View className="bg-[#F8F9FE] rounded-2xl shadow-sm py-2">
              {SECTIONS.SETTINGS.map(renderItem)}
              <TouchableOpacity
                className="flex-row items-center justify-between py-3 px-4 bg-[#F8F9FE]"
                onPress={handleLogout}
              >
                <View className="flex-row items-center">
                  <View
                    className="w-8 h-8 rounded-lg items-center justify-center mr-3"
                    style={{
                      backgroundColor: "#FF5A5F/20",
                    }}
                  >
                    <Ionicons name={"log-out"} size={18} color={"#FF5A5F"} />
                  </View>
                  <Text className={`text-[15px] font-medium`}>{"Logout"}</Text>
                </View>
                {/* {!item.isLogout && (
                  <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
                )} */}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
