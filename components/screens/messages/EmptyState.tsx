import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

const EmptyState = ({ query }: { query: string }) => (
  <View className="flex-1 items-center justify-center pt-20 px-10">
    <View className="bg-gray-100 p-6 rounded-full mb-4">
      <Ionicons name="search-outline" size={48} color="#9CA3AF" />
    </View>
    <Text className="text-[#1A1C1E] text-xl font-semibold mb-2">
      No results found
    </Text>
    <Text className="text-gray-500 text-center leading-5">
      We couldn&apos;t find any user with the name &quot;{query}&quot;. Please
      check your spelling or search for a different name!
    </Text>
  </View>
);

export default EmptyState;
