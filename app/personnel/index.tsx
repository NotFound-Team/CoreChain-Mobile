import { useAuthStore } from "@/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    useSafeAreaInsets
} from "react-native-safe-area-context";

// Mock Data Types based on user request and existing types
interface ISalaryInfo {
  id: string;
  employeeId: string;
  baseSalary: number;
  allowances: number;
  bonus: number;
  totalSalary: number;
  paymentDate: string;
  status: "Paid" | "Pending";
}

interface IKpiInfo {
  id: string;
  employeeId: string;
  period: string;
  score: number;
  rating: string;
  feedback: string;
}

// Mock Data
const MOCK_SALARY: ISalaryInfo = {
  id: "sal_001",
  employeeId: "user_123", // Will match current user dynamically
  baseSalary: 5000000,
  allowances: 1500000,
  bonus: 500000,
  totalSalary: 7000000,
  paymentDate: "2024-04-25",
  status: "Paid",
};

const MOCK_KPI: IKpiInfo = {
  id: "kpi_001",
  employeeId: "user_123",
  period: "Q1 2024",
  score: 85.5,
  rating: "Exceeds Expectations",
  feedback: "Excellent performance in project delivery.",
};

export default function PersonnelScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [salary, setSalary] = useState<ISalaryInfo | null>(null);
  const [kpi, setKpi] = useState<IKpiInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Simulate API calls: @Get('salary/:id') and @Get('kpi/:id')
      // effectively: fetchSalary(user.id) and fetchKpi(user.id)

      setTimeout(() => {
        // In a real app, we would use user.id to fetch specific data
        // For mock, we just use the static mock objects
        setSalary({ ...MOCK_SALARY, employeeId: user?.id || "unknown" });
        setKpi({ ...MOCK_KPI, employeeId: user?.id || "unknown" });

        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <View className="flex-1 bg-[#F8F9FE]">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 pb-4 pt-10 bg-white"
        style={{ paddingTop: Math.max(insets.top, 20) }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-[#F3F0FF]"
        >
          <Ionicons name="chevron-back" size={24} color="#8862F2" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-[#1A1C1E]">
          Payroll & Tax
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchData}
            tintColor="#4F46E5"
          />
        }
      >
        {/* Salary Section */}
        <View className="bg-white p-5 rounded-2xl mb-4 border border-gray-100 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="bg-green-100 p-2 rounded-full mr-3">
              <Ionicons name="cash-outline" size={24} color="#059669" />
            </View>
            <View>
              <Text className="text-lg font-bold text-gray-900">
                Salary Information
              </Text>
              <Text className="text-gray-400 text-xs font-semibold">
                {salary?.status}
              </Text>
            </View>
          </View>

          {isLoading ? (
            <Text className="text-gray-400 text-center py-4">
              Loading salary...
            </Text>
          ) : (
            <View className="space-y-3">
              <View className="flex-row justify-between border-b border-gray-50 pb-2">
                <Text className="text-gray-500">Base Salary</Text>
                <Text className="font-semibold text-gray-800">
                  {formatCurrency(salary?.baseSalary || 0)}
                </Text>
              </View>
              <View className="flex-row justify-between border-b border-gray-50 pb-2">
                <Text className="text-gray-500">Allowances</Text>
                <Text className="font-semibold text-gray-800">
                  {formatCurrency(salary?.allowances || 0)}
                </Text>
              </View>
              <View className="flex-row justify-between border-b border-gray-50 pb-2">
                <Text className="text-gray-500">Bonus</Text>
                <Text className="font-semibold text-gray-800">
                  {formatCurrency(salary?.bonus || 0)}
                </Text>
              </View>
              <View className="flex-row justify-between pt-2">
                <Text className="text-gray-900 font-bold">Total Received</Text>
                <Text className="font-bold text-green-600 text-lg">
                  {formatCurrency(salary?.totalSalary || 0)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* KPI Section */}
        <View className="bg-white p-5 rounded-2xl mb-4 border border-gray-100 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 p-2 rounded-full mr-3">
              <Ionicons name="trending-up-outline" size={24} color="#2563EB" />
            </View>
            <View>
              <Text className="text-lg font-bold text-gray-900">
                KPI Performance
              </Text>
              <Text className="text-gray-400 text-xs">{kpi?.period}</Text>
            </View>
          </View>

          {isLoading ? (
            <Text className="text-gray-400 text-center py-4">
              Loading KPI...
            </Text>
          ) : (
            <View>
              <View className="items-center py-4">
                <View className="w-24 h-24 rounded-full border-4 border-blue-100 items-center justify-center mb-2">
                  <Text className="text-3xl font-bold text-blue-600">
                    {kpi?.score}
                  </Text>
                </View>
                <Text className="text-gray-500 text-sm">Overall Score</Text>
              </View>

              <View className="bg-gray-50 p-3 rounded-xl mb-3">
                <Text className="text-gray-500 text-xs uppercase mb-1 font-bold">
                  Rating
                </Text>
                <Text className="text-gray-800 font-medium">{kpi?.rating}</Text>
              </View>

              <View className="bg-gray-50 p-3 rounded-xl">
                <Text className="text-gray-500 text-xs uppercase mb-1 font-bold">
                  Feedback
                </Text>
                <Text className="text-gray-800 font-medium italic">
                  &quot;{kpi?.feedback}&quot;
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
