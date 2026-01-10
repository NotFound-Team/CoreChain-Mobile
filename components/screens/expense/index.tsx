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
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { z } from "zod";
import { RequestListSkeleton } from "./RequestListSkeleton";

const CreateRequestModal = React.lazy(() => import("./CreateRequestModal"));


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
  amount: z.number().min(1000, "Tối thiểu 1.000đ"),
  reason: z.string().min(5, "Lý do tối thiểu 5 ký tự"),
  returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng YYYY-MM-DD"),
});

type CreateRequestFormValues = z.infer<typeof createRequestSchema>;

// --- MOCK DATA ---
const INITIAL_DATA: SalaryRequest[] = [
  {
    _id: "1",
    employee: "user_01",
    amount: 1000000,
    reason: "Đóng tiền nhà tháng 4",
    isApproved: false,
    returnDate: "2026-04-30T00:00:00.000Z",
    isDeleted: false,
    deletedAt: null,
    createdAt: "2026-01-07T09:05:44.807Z",
    updatedAt: "2026-01-07T09:05:44.807Z",
  },
];

// --- HELPER COMPONENTS ---

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
      active && "bg-violet-600 border-violet-600"
    )}
  >
    <Text
      className={cn(
        "font-medium text-sm text-gray-500",
        active && "text-white"
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
            item.isApproved ? "bg-green-100" : "bg-orange-100"
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
              item.isApproved ? "text-green-600" : "text-orange-600"
            )}
          >
            {item.isApproved ? "Đã duyệt" : "Chờ duyệt"}
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
          Hoàn trả: {new Date(item.returnDate).toLocaleDateString("vi-VN")}
        </Text>
      </View>

      <Text className="text-slate-400 text-xs">
        Ngày tạo: {new Date(item.createdAt).toLocaleDateString("vi-VN")}
      </Text>
    </View>
  </View>
);

// --- MAIN SCREEN ---

export const Expense = () => {
  const [requests, setRequests] = useState<SalaryRequest[]>(INITIAL_DATA);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "APPROVED" | "PENDING">("ALL");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const { user } = useAuthStore();

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

  const onSubmit: SubmitHandler<CreateRequestFormValues> = useCallback(async (data) => {
    try {
      setLoadingSubmit(true);
      await salaryAdvance(data);
      await fetchRequestSalary();
      toast.success("Thành công", {
        description: "Gửi yêu cầu thành công 🎉",
      });
      setModalVisible(false);
      reset();
    } catch (error) {
      toast.error("Thất bại", {
        description: "Có lỗi xảy ra, vui lòng thử lại",
      });
      console.log(error);
    } finally {
      setLoadingSubmit(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

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
      toast.error("Không thể tải danh sách");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchRequestSalary();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="px-5 pt-4 pb-6 bg-white shadow-sm">
        <Text className="text-2xl font-black text-slate-900">
          Salary Request
        </Text>
        <Text className="text-slate-400 text-sm mb-5">
          Theo dõi các khoản ứng lương
        </Text>

        <View className="flex-row">
          <FilterChip
            label="Tất cả"
            active={filter === "ALL"}
            onPress={() => setFilter("ALL")}
          />
          <FilterChip
            label="Chờ duyệt"
            active={filter === "PENDING"}
            onPress={() => setFilter("PENDING")}
          />
          <FilterChip
            label="Đã duyệt"
            active={filter === "APPROVED"}
            onPress={() => setFilter("APPROVED")}
          />
        </View>
      </View>

      {loadingList ? (
        <RequestListSkeleton />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <RequestCard item={item} />}
          contentContainerClassName="p-5 pb-24"
          ListEmptyComponent={
            <View className="items-center mt-20">
              <Search size={40} color="#cbd5e1" />
              <Text className="text-slate-400 mt-2">Trống</Text>
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
    </SafeAreaView>
  );
};
