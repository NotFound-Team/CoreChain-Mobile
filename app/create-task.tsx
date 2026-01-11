import { getDepartments } from "@/services/department.service";
import { createTask, getTaskDetail, updateTask } from "@/services/task.service";
import { useAuthStore } from "@/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import * as zod from "zod";

const taskSchema = zod.object({
  name: zod.string().min(1, "Name is required"),
  title: zod.string().min(1, "Title is required"),
  description: zod.string().min(1, "Description is required"),
  assignedTo: zod.string().min(1, "Assignee is required"),
  priority: zod.number().min(1).max(3),
  status: zod.number().min(1).max(4),
  startDate: zod.string().min(1, "Start date is required"),
  dueDate: zod.string().min(1, "Due date is required"),
});

type TaskFormData = zod.infer<typeof taskSchema>;

export default function CreateTaskScreen() {
  const { projectId, taskId, mode } = useLocalSearchParams<{
    projectId: string;
    taskId: string;
    mode: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMembers, setIsFetchingMembers] = useState(true);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 2,
      status: 1,
      startDate: dayjs().format("YYYY-MM-DD"),
      dueDate: dayjs().add(7, "day").format("YYYY-MM-DD"),
    },
  });

  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isDueDatePickerVisible, setDueDatePickerVisibility] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!user?.id) return;
      try {
        setIsFetchingMembers(true);
        const res = await getDepartments({ manager: user.id });
        if (!res.isError && res.data) {
          // Collect all employees from managed departments
          // Assuming employees might be objects or we need to fetch them
          // For now, let's assume if objects are there, use them, otherwise use search
          const allMembers: any[] = [];
          res.data.result.forEach((dept: any) => {
            if (Array.isArray(dept.employees)) {
              dept.employees.forEach((emp: any) => {
                if (typeof emp === "object") {
                  allMembers.push(emp);
                } else {
                  allMembers.push({ _id: emp, name: `User ID: ${emp}` });
                }
              });
            }
          });

          // Deduplicate
          const uniqueMembers = Array.from(
            new Map(allMembers.map((m) => [m._id, m])).values()
          );
          setMembers(uniqueMembers);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setIsFetchingMembers(false);
      }
    };

    fetchMembers();
  }, [user?.id]);

  useEffect(() => {
    if (mode === "edit" && taskId) {
      const fetchTaskDetail = async () => {
        setIsLoading(true);
        const res = await getTaskDetail(taskId);
        if (!res.isError && res.data) {
          const task = res.data;
          reset({
            name: task.name,
            title: task.title,
            description: task.description,
            assignedTo:
              typeof task.assignedTo === "object"
                ? task.assignedTo._id
                : task.assignedTo,
            priority: task.priority,
            status: task.status,
            startDate: dayjs(task.startDate).format("YYYY-MM-DD"),
            dueDate: dayjs(task.dueDate).format("YYYY-MM-DD"),
          });
        }
        setIsLoading(false);
      };
      fetchTaskDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, mode]);

  const onSubmit = async (data: TaskFormData) => {
    if (!projectId && !taskId) return;
    try {
      setIsLoading(true);
      const payload = {
        ...data,
        projectId: projectId || (mode === "edit" ? undefined : projectId), // Ensure projectId is sent for new tasks
        // For edit, the service uses taskId directly
      };

      let res;
      if (mode === "edit" && taskId) {
        res = await updateTask(taskId, data);
      } else {
        res = await createTask({ ...payload, projectId });
      }

      if (!res.isError) {
        toast.success(mode === "edit" ? "Task updated!" : "Task created!");
        router.back();
      } else {
        Alert.alert("Error", res.message || "Failed to save task");
      }
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (
    name: keyof TaskFormData,
    label: string,
    placeholder: string,
    multiline = false
  ) => (
    <View className="mb-4">
      <Text className="text-gray-500 font-bold text-xs uppercase mb-2 ml-1">
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <View
            className={`bg-white rounded-2xl border ${errors[name] ? "border-red-500" : "border-gray-100"} p-4`}
          >
            <TextInput
              onChangeText={onChange}
              onBlur={onBlur}
              value={value?.toString()}
              placeholder={placeholder}
              multiline={multiline}
              numberOfLines={multiline ? 4 : 1}
              textAlignVertical={multiline ? "top" : "center"}
              className="text-[#1A1C1E] font-medium"
            />
          </View>
        )}
      />
      {errors[name] && (
        <Text className="text-red-500 text-[10px] mt-1 ml-1">
          {errors[name]?.message}
        </Text>
      )}
    </View>
  );

  const renderDatePicker = (name: "startDate" | "dueDate", label: string) => (
    <View className="flex-1">
      <Text className="text-gray-500 font-bold text-xs uppercase mb-2 ml-1">
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { value } }) => (
          <TouchableOpacity
            onPress={() =>
              name === "startDate"
                ? setStartDatePickerVisibility(true)
                : setDueDatePickerVisibility(true)
            }
            className={`bg-white rounded-2xl border ${errors[name] ? "border-red-500" : "border-gray-100"} p-4 flex-row items-center justify-between`}
          >
            <Text className="text-[#1A1C1E] font-medium">
              {value ? dayjs(value).format("DD MMM, YYYY") : "Select date"}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#8862F2" />
          </TouchableOpacity>
        )}
      />
      {errors[name] && (
        <Text className="text-red-500 text-[10px] mt-1 ml-1">
          {errors[name]?.message}
        </Text>
      )}
    </View>
  );

  const handleConfirmStartDate = (date: Date) => {
    setValue("startDate", dayjs(date).format("YYYY-MM-DD"));
    setStartDatePickerVisibility(false);
  };

  const handleConfirmDueDate = (date: Date) => {
    setValue("dueDate", dayjs(date).format("YYYY-MM-DD"));
    setDueDatePickerVisibility(false);
  };

  return (
    <View className="flex-1 bg-[#F8F9FE]">
      {/* Header */}
      <View
        className="bg-white px-6 shadow-sm"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center justify-between pb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
          >
            <Ionicons name="close" size={24} color="#1A1C1E" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-[#1A1C1E]">
            {mode === "edit" ? "Edit Task" : "New Task"}
          </Text>
          <View className="w-10" />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6 pt-6"
          showsVerticalScrollIndicator={false}
        >
          {renderInput("name", "Task Name", "Enter task name")}
          {renderInput("title", "Title", "E.g. Design Dashboard")}
          {renderInput(
            "description",
            "Description",
            "Add more details...",
            true
          )}

          {/* Assigned To Selection */}
          <View className="mb-4">
            <Text className="text-gray-500 font-bold text-xs uppercase mb-2 ml-1">
              Assigned To
            </Text>
            {isFetchingMembers ? (
              <ActivityIndicator color="#8862F2" />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row py-2"
              >
                {members.map((member) => (
                  <Controller
                    key={member._id}
                    control={control}
                    name="assignedTo"
                    render={({ field: { value, onChange } }) => (
                      <TouchableOpacity
                        onPress={() => onChange(member._id)}
                        className={`mr-3 px-4 py-3 rounded-2xl border-2 ${
                          value === member._id
                            ? "border-[#8862F2] bg-purple-50"
                            : "border-gray-100 bg-white"
                        }`}
                      >
                        <View className="flex-row items-center">
                          <View className="w-8 h-8 rounded-full bg-purple-100 items-center justify-center mr-2">
                            <Text className="text-[#8862F2] font-black">
                              {member.name?.charAt(0)}
                            </Text>
                          </View>
                          <Text
                            className={`font-bold text-xs ${value === member._id ? "text-[#8862F2]" : "text-gray-600"}`}
                          >
                            {member.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                ))}
              </ScrollView>
            )}
            {errors.assignedTo && (
              <Text className="text-red-500 text-[10px] mt-1 ml-1">
                {errors.assignedTo.message}
              </Text>
            )}
          </View>

          {/* Priority Status Grid */}
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <Text className="text-gray-500 font-bold text-xs uppercase mb-2 ml-1">
                Priority
              </Text>
              <Controller
                control={control}
                name="priority"
                render={({ field: { value, onChange } }) => (
                  <View className="flex-row bg-white p-1 rounded-2xl border border-gray-100">
                    {[1, 2, 3].map((p) => (
                      <TouchableOpacity
                        key={p}
                        onPress={() => onChange(p)}
                        className={`flex-1 py-2 items-center rounded-xl ${value === p ? "bg-[#8862F2]" : ""}`}
                      >
                        <Text
                          className={`font-black text-[10px] ${value === p ? "text-white" : "text-gray-400"}`}
                        >
                          {p === 1 ? "LOW" : p === 2 ? "MED" : "HIGH"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
            </View>
            <View className="flex-1">
              <Text className="text-gray-500 font-bold text-xs uppercase mb-2 ml-1">
                Status
              </Text>
              <Controller
                control={control}
                name="status"
                render={({ field: { value, onChange } }) => (
                  <View className="flex-row bg-white p-1 rounded-2xl border border-gray-100">
                    {[1, 2, 3, 4].map((s) => (
                      <TouchableOpacity
                        key={s}
                        onPress={() => onChange(s)}
                        className={`flex-1 py-2 items-center rounded-xl ${value === s ? "bg-[#8862F2]" : ""}`}
                      >
                        <Text
                          className={`font-black text-[10px] ${value === s ? "text-white" : "text-gray-400"}`}
                        >
                          {s}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
            </View>
          </View>

          {/* Dates */}
          <View className="flex-row gap-4 mb-10">
            {renderDatePicker("startDate", "Start Date")}
            {renderDatePicker("dueDate", "Due Date")}
          </View>

          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            date={dayjs(control._formValues.startDate).toDate()}
            onConfirm={handleConfirmStartDate}
            onCancel={() => setStartDatePickerVisibility(false)}
          />
          <DateTimePickerModal
            isVisible={isDueDatePickerVisible}
            mode="date"
            date={dayjs(control._formValues.dueDate).toDate()}
            onConfirm={handleConfirmDueDate}
            onCancel={() => setDueDatePickerVisibility(false)}
          />

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Floating Action Button */}
      <View className="absolute bottom-6 left-0 right-0 px-6">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="w-full bg-[#8862F2] h-14 rounded-full flex-row items-center justify-center shadow-lg shadow-purple-200"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">
              {mode === "edit" ? "Update Task" : "Create Task"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
