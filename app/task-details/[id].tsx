import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Task ID: {id}</Text>
    </View>
  );
}
