import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const getPriorityStyles = (priority: number) => {
  switch (priority) {
    case 3:
      return { label: "High", color: "bg-red-500", text: "text-white" };
    case 2:
      return { label: "Medium", color: "bg-orange-400", text: "text-white" };
    default:
      return { label: "Low", color: "bg-blue-400", text: "text-white" };
  }
};

const getStatusStyles = (status: number) => {
  switch (status) {
    case 1:
      return {
        label: "In Progress",
        color: "bg-blue-50/50",
        text: "text-blue-600",
      };
    case 2:
      return {
        label: "Review",
        color: "bg-purple-50",
        text: "text-purple-600",
      };
    case 3:
      return { label: "Done", color: "bg-green-50", text: "text-green-600" };
    default:
      return { label: "Unknown", color: "bg-gray-100", text: "text-gray-600" };
  }
};

export const TaskItem = ({ item }: { item: any }) => {
  const router = useRouter();
  const priority = getPriorityStyles(item.priority);
  const status = getStatusStyles(item.status);
  const formattedDate = new Date(item.dueDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  const handlePress = (id: string) => {
    console.log(id);
    router.push(`/task-details/${id}`);
  };

  return (
    <TouchableOpacity
      className="bg-white mx-4 mb-4 p-4 rounded-[20px] shadow-sm border border-gray-50"
      activeOpacity={0.8}
      onPress={() => handlePress(item?._id)}
    >
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
          <Ionicons name="flash" size={20} color="#8862F2" />
        </View>
        <View className="flex-1">
          <Text
            className="text-[16px] font-bold text-[#1A1C1E]"
            numberOfLines={1}
          >
            {item.title}
          </Text>
        </View>
      </View>

      {/* Badges: Status & Priority */}
      <View className="flex-row mb-4">
        <View
          className={`${status.color} px-3 py-1 rounded-full mr-2 flex-row items-center`}
        >
          <View
            className={`w-1.5 h-1.5 rounded-full ${status.text.replace("text", "bg")} mr-1.5`}
          />
          <Text className={`${status.text} text-[11px] font-semibold`}>
            {status.label}
          </Text>
        </View>

        <View
          className={`${priority.color} px-3 py-1 rounded-full flex-row items-center`}
        >
          <Ionicons name="flag" size={10} color="white" className="mr-1" />
          <Text className="text-white text-[11px] font-semibold ml-1">
            {priority.label}
          </Text>
        </View>
      </View>

      <View className="w-full h-[6px] bg-gray-100 rounded-full mb-4 overflow-hidden">
        <View
          className="h-full bg-[#8862F2]"
          style={{ width: item.status >= 2 ? "100%" : "40%" }}
        />
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row">
          {["Alicia", "Jessica"].map((seed, idx) => (
            <View
              key={idx}
              className={`w-7 h-7 rounded-full border-2 border-white -ml-2 bg-gray-200 overflow-hidden ${idx === 0 ? "ml-0" : ""}`}
            >
              <Image
                source={{
                  uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
                }}
                className="w-full h-full"
              />
            </View>
          ))}
        </View>

        <View className="flex-row items-center">
          <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-lg mr-2">
            <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
            <Text className="text-gray-500 text-[11px] font-medium ml-1">
              {formattedDate}
            </Text>
          </View>

          <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-lg">
            <Ionicons name="chatbubble-outline" size={14} color="#9CA3AF" />
            <Text className="text-gray-500 text-[11px] font-medium ml-1">
              2
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
