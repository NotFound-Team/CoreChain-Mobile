import DepartmentDetail from "@/components/screens/department/DepartmentDetail";
import { useLocalSearchParams } from "expo-router";

export default function DepartmentDetailScreen() {
  const { id } = useLocalSearchParams();
  return <DepartmentDetail id={id as string} />;
}
