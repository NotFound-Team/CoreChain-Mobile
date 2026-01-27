import { cn } from "@/libs/cn";
import { getSalaryList, salaryAdvance } from "@/services/personnel.service";
import { useAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Search,
} from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { z } from "zod";
import CreateRequestModal from "./CreateRequestModal";
import { RequestListSkeleton } from "./RequestListSkeleton";

// --- TYPES ---
interface SalaryRequest {
  _id: string;
  employee: string;
  amount: number;
  reason: string;
  isApproved: boolean;
  returnDate: string;
  isDeleted: boolean;
  deletedAt: null | string;
  createdAt: string;
  updatedAt: string;
}

const createRequestSchema = z.object({
  amount: z.number().min(1000, "Minimum 1000"),
  reason: z.string().min(5, "Reason (minimum 5 characters)"),
  returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD"),
});

type CreateRequestFormValues = z.infer<typeof createRequestSchema>;

const FilterChip = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={cn(
      "px-4 py-2 rounded-full mr-2 border border-gray-200 bg-white",
      active && "bg-violet-600 border-violet-600",
    )}
  >
    <Text
      className={cn(
        "font-medium text-sm text-gray-500",
        active && "text-white",
      )}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const RequestCard = ({ item }: { item: SalaryRequest }) => (
  <View className="bg-white rounded-3xl p-4 mb-4 shadow-sm border border-slate-50">
    <View className="flex-row items-center justify-between mb-4">
      <View className="flex-row items-center gap-3">
        <View
          className={cn(
            "w-11 h-11 rounded-full items-center justify-center",
            item.isApproved ? "bg-green-100" : "bg-orange-100",
          )}
        >
          {item.isApproved ? (
            <CheckCircle2 size={22} color="#16a34a" />
          ) : (
            <Clock size={22} color="#ea580c" />
          )}
        </View>
        <View>
          <Text className="text-slate-900 font-bold text-lg">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(item.amount)}
          </Text>
          <Text
            className={cn(
              "text-[10px] font-bold uppercase tracking-wider",
              item.isApproved ? "text-green-600" : "text-orange-600",
            )}
          >
            {item.isApproved ? "Approved" : "Pending"}
          </Text>
        </View>
      </View>
    </View>

    <View className="bg-slate-50 p-3 rounded-2xl mb-4">
      <Text className="text-slate-600 text-sm leading-5">{item.reason}</Text>
    </View>

    <View className="flex-row justify-between border-t border-slate-50 pt-3">
      <View className="flex-row items-center gap-1">
        <Calendar size={12} color="#94a3b8" />
        <Text className="text-slate-400 text-xs">
          Return Date: {new Date(item.returnDate).toLocaleDateString("vi-VN")}
        </Text>
      </View>

      <Text className="text-slate-400 text-xs">
        Created At: {new Date(item.createdAt).toLocaleDateString("vi-VN")}
      </Text>
    </View>
  </View>
);

// --- MAIN SCREEN ---

export const Expense = () => {
  const [requests, setRequests] = useState<SalaryRequest[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "APPROVED" | "PENDING">("ALL");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  }, []);

  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRequestFormValues>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      amount: undefined,
      reason: "",
      returnDate: "",
    },
  });

  const filteredData = useMemo(() => {
    if (filter === "APPROVED") return requests.filter((r) => r.isApproved);
    if (filter === "PENDING") return requests.filter((r) => !r.isApproved);
    return requests;
  }, [requests, filter]);

  const onSubmit: SubmitHandler<CreateRequestFormValues> = useCallback(
    async (data) => {
      try {
        setLoadingSubmit(true);
        await salaryAdvance(data);
        await fetchRequestSalary();
        toast.success("Success", {
          description: "Request submitted successfully.",
        });
        setModalVisible(false);
        reset();
      } catch (error) {
        toast.error("Failed", {
          description: "An error occurred, please try again.",
        });
        console.log(error);
      } finally {
        setLoadingSubmit(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reset],
  );

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const fetchRequestSalary = async () => {
    try {
      setLoadingList(true);
      const res = await getSalaryList({ employee: user?.id });
      if (!res.isError) {
        setRequests(res.data.result);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to load list");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchRequestSalary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        className="px-5 pb-6 bg-white shadow-sm"
        style={{ paddingTop: insets.top + 16 }}
      >
        <Text className="text-2xl font-black text-slate-900">
          Salary Request
        </Text>
        <Text className="text-slate-400 text-sm mb-5">
          Track salary advances
        </Text>

        <View className="flex-row">
          <FilterChip
            label="All"
            active={filter === "ALL"}
            onPress={() => setFilter("ALL")}
          />
          <FilterChip
            label="Waiting"
            active={filter === "PENDING"}
            onPress={() => setFilter("PENDING")}
          />
          <FilterChip
            label="Approved"
            active={filter === "APPROVED"}
            onPress={() => setFilter("APPROVED")}
          />
        </View>
      </View>

      {loadingList ? (
        <RequestListSkeleton />
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={["#8862F2", "#8862F2"]}
              tintColor="#8862F2"
            />
          }
          data={filteredData}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <RequestCard item={item} />}
          contentContainerClassName="p-5 pb-24"
          ListEmptyComponent={
            <View className="items-center mt-20">
              <Search size={40} color="#cbd5e1" />
              <Text className="text-slate-400 mt-2">Empty</Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="absolute bottom-10 right-6 w-16 h-16 bg-violet-600 rounded-full items-center justify-center shadow-xl shadow-violet-400"
      >
        <Plus size={32} color="white" />
      </TouchableOpacity>

      {/* Modal Form */}
      <CreateRequestModal
        visible={modalVisible}
        loading={loadingSubmit}
        control={control as never}
        errors={errors}
        onClose={handleCloseModal}
        onSubmit={handleSubmit(onSubmit)}
      />
      {loadingSubmit && (
        <View className="absolute inset-0 bg-black/30 items-center justify-center">
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
    </View>
  );
};
