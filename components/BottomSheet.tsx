import React, { createContext, useContext, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export interface BottomSheetProps {
  children: React.ReactNode;
  visible: boolean;
  onClose: () => void;

  /**
   * The `animationType` prop controls how the modal animates.
   *
   * - `slide` slides in from the bottom
   * - `fade` fades into view
   * - `none` appears without an animation
   */
  animationType?: "none" | "slide" | "fade" | undefined;
}

export interface BottomSheetContentProps {
  children: React.ReactNode;

  /**
   * min value is 0.1
   * max value is 1
   */
  heightPercentage?: number;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;
const BottomSheetContext = createContext<any>(null);
const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) throw new Error("You must use in BottomSheet");
  return context;
};

export const BottomSheet = ({
  children,
  visible,
  onClose,
  animationType = "fade",
}: BottomSheetProps) => {
  const panY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(panY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleClose = () => {
    Animated.timing(panY, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(onClose);
  };

  return (
    <BottomSheetContext.Provider
      value={{ panY, handleClose, visible, animationType }}
    >
      <Modal
        visible={visible}
        animationType={`${animationType}`}
        transparent
        onRequestClose={handleClose}
      >
        <View className="flex-1 justify-end bg-black/40">{children}</View>
      </Modal>
    </BottomSheetContext.Provider>
  );
};

BottomSheet.Overlay = function Overlay() {
  const { handleClose } = useBottomSheet();
  return (
    <TouchableWithoutFeedback onPress={handleClose}>
      <View className="absolute inset-0" />
    </TouchableWithoutFeedback>
  );
};

BottomSheet.Content = function Content({
  children,
  heightPercentage = 0.5,
}: BottomSheetContentProps) {
  const { panY, handleClose } = useBottomSheet();

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
          Animated.timing(panY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start(handleClose);
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 5,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        height: SCREEN_HEIGHT * heightPercentage,
        transform: [{ translateY: panY }],
      }}
      className="bg-white rounded-t-[40px] px-6 pb-10"
    >
      <View className="w-full py-4 items-center">
        <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
      </View>
      {children}
    </Animated.View>
  );
};

// BottomSheet.Handle = function Handle() {
//   const { handleClose, panY } = useBottomSheet();
//   const panResponder = useRef(
//     PanResponder.create({
//       onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
//       onPanResponderMove: (_, g) => {
//         if (g.dy > 0) panY.setValue(g.dy);
//       },
//       onPanResponderRelease: (_, g) => {
//         if (g.dy > 120) handleClose();
//         else
//           Animated.spring(panY, { toValue: 0, useNativeDriver: true }).start();
//       },
//     }),
//   ).current;

//   return (
//     <View {...panResponder.panHandlers} className="w-full py-4 items-center">
//       <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
//     </View>
//   );
// };
