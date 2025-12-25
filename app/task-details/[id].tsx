import { TaskDetails } from "@/components/screens/task-details";
import { useLocalSearchParams } from "expo-router";

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams();
  console.log("SCREEN DETAILS", id);

  return <TaskDetails id={id as string} />;
}
