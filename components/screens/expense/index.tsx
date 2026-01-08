import { cn } from "@/libs/cn";
import { getSalaryList, salaryAdvance } from "@/services/personnel.service";
import { useAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Plus,
  Search,
  X,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { z } from "zod";
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

// --- ZOD SCHEMA ---
const createRequestSchema = z.object({
  amount: z.coerce.number().min(1000, "Tối thiểu 1.000đ"),
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

  const onSubmit: SubmitHandler<CreateRequestFormValues> = async (data) => {
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
  };

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
      <Modal visible={modalVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-end bg-slate-900/50">
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="bg-white rounded-t-[40px] px-6 pt-8 pb-10"
            >
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-bold text-slate-900">
                  Tạo yêu cầu
                </Text>
                <TouchableOpacity
                  disabled={loadingSubmit}
                  onPress={() => !loadingSubmit && setModalVisible(false)}
                  className="bg-slate-100 p-2 rounded-full"
                >
                  <X size={20} color="#64748b" />
                </TouchableOpacity>
              </View>

              {/* Amount Input */}
              <View className="mb-4">
                <Text className="text-slate-500 text-xs font-bold mb-2 uppercase ml-1">
                  Số tiền ứng
                </Text>
                <Controller
                  control={control}
                  name="amount"
                  render={({ field: { onChange, value } }) => (
                    <View
                      className={cn(
                        "flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 h-14",
                        errors.amount && "border-red-500 bg-red-50/10"
                      )}
                    >
                      <DollarSign
                        size={20}
                        color={errors.amount ? "#ef4444" : "#94a3b8"}
                      />
                      <TextInput
                        className="flex-1 ml-2 text-slate-900 font-bold text-lg"
                        placeholder="1,000,000"
                        keyboardType="numeric"
                        value={value?.toString()}
                        onChangeText={(text) => {
                          const cleaned = text.replace(/[^0-9]/g, "");
                          onChange(cleaned === "" ? "" : Number(cleaned));
                        }}
                      />
                    </View>
                  )}
                />
                {errors.amount && (
                  <Text className="text-red-500 text-[10px] mt-1 ml-2 font-medium">
                    {errors.amount.message}
                  </Text>
                )}
              </View>

              {/* Date Input */}
              <View className="mb-4">
                <Text className="text-slate-500 text-xs font-bold mb-2 uppercase ml-1">
                  Ngày hoàn trả
                </Text>
                <Controller
                  control={control}
                  name="returnDate"
                  render={({ field: { onChange, value } }) => (
                    <View
                      className={cn(
                        "flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 h-14",
                        errors.returnDate && "border-red-500 bg-red-50/10"
                      )}
                    >
                      <Calendar
                        size={20}
                        color={errors.returnDate ? "#ef4444" : "#94a3b8"}
                      />
                      <TextInput
                        className="flex-1 ml-2 text-slate-900"
                        placeholder="YYYY-MM-DD"
                        value={value}
                        onChangeText={onChange}
                      />
                    </View>
                  )}
                />
                {errors.returnDate && (
                  <Text className="text-red-500 text-[10px] mt-1 ml-2 font-medium">
                    {errors.returnDate.message}
                  </Text>
                )}
              </View>

              {/* Reason Input */}
              <View className="mb-8">
                <Text className="text-slate-500 text-xs font-bold mb-2 uppercase ml-1">
                  Lý do
                </Text>
                <Controller
                  control={control}
                  name="reason"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className={cn(
                        "bg-slate-50 border border-slate-100 rounded-2xl p-4 h-28 text-slate-900",
                        errors.reason && "border-red-500 bg-red-50/10"
                      )}
                      placeholder="Nhập nội dung..."
                      multiline
                      textAlignVertical="top"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
                {errors.reason && (
                  <Text className="text-red-500 text-[10px] mt-1 ml-2 font-medium">
                    {errors.reason.message}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                disabled={loadingSubmit}
                onPress={handleSubmit(onSubmit)}
                className={cn(
                  "h-16 rounded-2xl items-center justify-center shadow-lg shadow-violet-200",
                  loadingSubmit ? "bg-violet-400" : "bg-violet-600"
                )}
              >
                {loadingSubmit ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-extrabold text-lg">
                    Gửi yêu cầu ngay
                  </Text>
                )}
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {loadingSubmit && (
        <View className="absolute inset-0 bg-black/30 items-center justify-center">
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
    </SafeAreaView>
  );
};
