import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  Modal,
  PanResponder,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface BottomSheetModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  heightPercentage?: number;
}

export const BottomSheetModal = ({
  visible,
  onClose,
  children,
  heightPercentage = 0.5,
}: BottomSheetModalProps) => {
  const panY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const openModal = () => {
    Animated.timing(panY, {
      toValue: 0,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Keyboard.dismiss();
    Animated.timing(panY, {
      toValue: SCREEN_HEIGHT,
      duration: 240,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) panY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120) closeModal();
        else {
          Animated.timing(panY, {
            toValue: 0,
            duration: 200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (visible) openModal();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={closeModal}
    >
      <View className="flex-1 justify-end bg-black/40">
        <TouchableWithoutFeedback onPress={closeModal}>
          <View className="absolute inset-0" />
        </TouchableWithoutFeedback>

        <Animated.View
          style={{
            height: SCREEN_HEIGHT * heightPercentage,
            transform: [{ translateY: panY }],
          }}
          className="bg-white rounded-t-[40px] px-6 pt-2 pb-10"
        >
          {/* Thanh cầm (Handle bar) */}
          <View
            {...panResponder.panHandlers}
            className="w-full py-4 items-center"
          >
            <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
          </View>

          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};
