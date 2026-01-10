import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface FilterState {
  priority: number | null;
  projectId: string | null;
  sortBy: string;
}

interface FilterModalProps {
  visible: boolean;
  tempFilters: FilterState;
  onClose: () => void;
  onApply: () => void;
  onFilterChange: (filters: FilterState) => void;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;

function FilterModal({
  visible,
  tempFilters,
  onClose,
  onApply,
  onFilterChange,
}: FilterModalProps) {
  const panY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150) {
          closeModal();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(panY, {
        toValue: 0,
        tension: 50,
        friction: 10,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

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
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={closeModal}
    >
      <View className="flex-1 justify-end bg-black/40">
        <TouchableWithoutFeedback onPress={closeModal}>
          <View className="absolute inset-0" />
        </TouchableWithoutFeedback>

        <Animated.View
          style={{
            height: SCREEN_HEIGHT * 0.7,
            transform: [{ translateY: panY }],
          }}
          className="bg-white rounded-t-[40px] p-6 shadow-2xl"
        >
          <View
            {...panResponder.panHandlers}
            className="w-full pt-2 pb-6 items-center"
          >
            <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
          </View>

          <Text className="text-xl font-bold mb-6">Filter Settings</Text>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            {/* Filter Priority */}
            <Text className="text-gray-400 font-bold text-xs mb-3 uppercase">
              Priority
            </Text>
            <View className="flex-row mb-6">
              {[null, 1, 2, 3].map((p) => (
                <TouchableOpacity
                  key={String(p)}
                  onPress={() =>
                    onFilterChange({ ...tempFilters, priority: p })
                  }
                  className={`mr-2 px-5 py-2 rounded-full border ${
                    tempFilters.priority === p
                      ? "bg-[#8862F2] border-[#8862F2]"
                      : "border-gray-200"
                  }`}
                >
                  <Text
                    className={
                      tempFilters.priority === p
                        ? "text-white"
                        : "text-gray-500"
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
        </Animated.View>
      </View>
    </Modal>
  );
}

export default React.memo(FilterModal);
