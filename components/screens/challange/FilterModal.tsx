import { BottomSheet } from "@/components/BottomSheet";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface FilterState {
  priority: number | null;
  projectId: string | null;
  sortBy: string;
  dateType: "createdAt" | "startDate" | "dueDate";
  startDate: Date | null;
  endDate: Date | null;
}

interface FilterModalProps {
  visible: boolean;
  tempFilters: FilterState;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  onFilterChange: (filters: FilterState) => void;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;

function FilterModal({
  visible,
  tempFilters,
  onClose,
  onApply,
  onFilterChange,
  onClear,
}: FilterModalProps) {
  const panY = useRef(new Animated.Value(0)).current;
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [dateField, setDateField] = useState<"startDate" | "endDate" | null>(
    null,
  );

  const showDatePicker = (field: "startDate" | "endDate") => {
    setDateField(field);
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
    setDateField(null);
  };

  const handleConfirm = (date: Date) => {
    if (dateField) {
      onFilterChange({ ...tempFilters, [dateField]: date });
    }
    hideDatePicker();
  };

  const closeModal = () => {
    Animated.timing(panY, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <BottomSheet.Overlay />
      <BottomSheet.Content heightPercentage={0.7}>
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold">Filter Settings</Text>
          <TouchableOpacity onPress={onClear}>
            <Text className="text-[#8862F2] font-bold">Clear</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Filter Priority */}
          <Text className="text-gray-400 font-bold text-xs mb-3 uppercase">
            Priority
          </Text>
          <View className="flex-row mb-6">
            {[null, 1, 2, 3].map((p) => (
              <TouchableOpacity
                key={String(p)}
                onPress={() => onFilterChange({ ...tempFilters, priority: p })}
                className={`mr-2 px-5 py-2 rounded-full border ${
                  tempFilters.priority === p
                    ? "bg-[#8862F2] border-[#8862F2]"
                    : "border-gray-200"
                }`}
              >
                <Text
                  className={
                    tempFilters.priority === p ? "text-white" : "text-gray-500"
                  }
                >
                  {p === null
                    ? "All"
                    : p === 3
                      ? "High"
                      : p === 2
                        ? "Med"
                        : "Low"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Date Type Filter */}
          <Text className="text-gray-400 font-bold text-xs mb-3 uppercase">
            Filter By Date
          </Text>
          <View className="flex-row mb-4">
            {["createdAt", "startDate", "dueDate"].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() =>
                  onFilterChange({ ...tempFilters, dateType: type as any })
                }
                className={`mr-2 px-4 py-2 rounded-xl border ${
                  tempFilters.dateType === type
                    ? "bg-[#F3EFff] border-[#8862F2]"
                    : "border-gray-200"
                }`}
              >
                <Text
                  className={
                    tempFilters.dateType === type
                      ? "text-[#8862F2] font-bold"
                      : "text-gray-500"
                  }
                >
                  {type === "createdAt"
                    ? "Created"
                    : type === "startDate"
                      ? "Start"
                      : "Due"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Date Range Fields */}
          <View className="flex-row gap-4 mb-6">
            <View className="flex-1">
              <Text className="text-gray-500 text-xs mb-1 ml-1">From</Text>
              <TouchableOpacity
                onPress={() => showDatePicker("startDate")}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
              >
                <Text
                  className={
                    tempFilters.startDate ? "text-gray-900" : "text-gray-400"
                  }
                >
                  {tempFilters.startDate
                    ? dayjs(tempFilters.startDate).format("DD MMM YYYY")
                    : "Select Date"}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-1">
              <Text className="text-gray-500 text-xs mb-1 ml-1">To</Text>
              <TouchableOpacity
                onPress={() => showDatePicker("endDate")}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
              >
                <Text
                  className={
                    tempFilters.endDate ? "text-gray-900" : "text-gray-400"
                  }
                >
                  {tempFilters.endDate
                    ? dayjs(tempFilters.endDate).format("DD MMM YYYY")
                    : "Select Date"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sort By */}
          <Text className="text-gray-400 font-bold text-xs mb-3 uppercase">
            Sort By
          </Text>
          <View className="flex-row flex-wrap mb-6">
            {["dueDate", "startDate", "createdAt"].map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => onFilterChange({ ...tempFilters, sortBy: s })}
                className={`mr-2 mb-2 px-4 py-2 rounded-xl border ${
                  tempFilters.sortBy === s
                    ? "bg-[#F3EFff] border-[#8862F2]"
                    : "border-gray-100"
                }`}
              >
                <Text
                  className={
                    tempFilters.sortBy === s
                      ? "text-[#8862F2] font-bold"
                      : "text-gray-500"
                  }
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View className="flex-row gap-4 mt-4 pb-4">
          <TouchableOpacity
            onPress={closeModal}
            className="flex-1 bg-gray-100 h-14 rounded-2xl items-center justify-center"
          >
            <Text className="text-gray-500 font-bold">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onApply}
            className="flex-[2] bg-[#8862F2] h-14 rounded-2xl items-center justify-center"
          >
            <Text className="text-white font-bold">Apply</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet.Content>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </BottomSheet>
  );
}

export default React.memo(FilterModal);
