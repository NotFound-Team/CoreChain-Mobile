// import { cn } from "@/libs/cn";
// import { Calendar, DollarSign, X } from "lucide-react-native";
// import React, { useEffect, useRef } from "react";
// import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";
// import {
//   ActivityIndicator,
//   Animated,
//   Dimensions,
//   Easing,
//   Keyboard,
//   Modal,
//   PanResponder,
//   Platform,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";

// interface CreateRequestModalProps {
//   visible: boolean;
//   loading: boolean;
//   control: Control<FieldValues>;
//   errors: FieldErrors<FieldValues>;
//   onClose: () => void;
//   onSubmit: () => void;
// }

// const SCREEN_HEIGHT = Dimensions.get("window").height;

// function CreateRequestModal({
//   visible,
//   loading,
//   control,
//   errors,
//   onClose,
//   onSubmit,
// }: CreateRequestModalProps) {
//   const panY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

//   const openModal = () => {
//     Animated.timing(panY, {
//       toValue: 0,
//       duration: 280,
//       easing: Easing.out(Easing.cubic),
//       useNativeDriver: true,
//     }).start();
//   };

//   const closeModal = () => {
//     Keyboard.dismiss();
//     Animated.timing(panY, {
//       toValue: SCREEN_HEIGHT,
//       duration: 240,
//       easing: Easing.in(Easing.cubic),
//       useNativeDriver: true,
//     }).start(() => {
//       onClose();
//     });
//   };

//   const panResponder = useRef(
//     PanResponder.create({
//       onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
//       onPanResponderMove: (_, gestureState) => {
//         if (gestureState.dy > 0) {
//           panY.setValue(gestureState.dy);
//         }
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         if (gestureState.dy > 120) {
//           closeModal();
//         } else {
//           Animated.timing(panY, {
//             toValue: 0,
//             duration: 200,
//             easing: Easing.out(Easing.cubic),
//             useNativeDriver: true,
//           }).start();
//         }
//       },
//     }),
//   ).current;

//   useEffect(() => {
//     if (visible) {
//       openModal();
//     }
//   }, [visible]);

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       onRequestClose={closeModal}
//     >
//       <View className="flex-1 justify-end bg-black/40">
//         <TouchableWithoutFeedback
//           onPress={() => {
//             Keyboard.dismiss();
//             closeModal();
//           }}
//         >
//           <View className="absolute inset-0" />
//         </TouchableWithoutFeedback>

//         <Animated.View
//           style={{
//             height: SCREEN_HEIGHT * 0.56,
//             transform: [{ translateY: panY }],
//           }}
//           className="bg-white rounded-t-[40px] px-6 pt-8 pb-10"
//         >
//           <View
//             {...panResponder.panHandlers}
//             className="w-full pt-2 pb-6 items-center"
//           >
//             <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
//           </View>

//           <View className="flex-row justify-between items-center mb-6">
//             <Text className="text-xl font-bold text-slate-900">
//               Tạo yêu cầu
//             </Text>
//             <TouchableOpacity
//               disabled={loading}
//               onPress={closeModal}
//               className="bg-slate-100 p-2 rounded-full"
//             >
//               <X size={20} color="#64748b" />
//             </TouchableOpacity>
//           </View>

//           {/* Amount Input */}
//           <View className="mb-4">
//             <Text className="text-slate-500 text-xs font-bold mb-2 uppercase ml-1">
//               Số tiền ứng
//             </Text>
//             <Controller
//               control={control}
//               name="amount"
//               render={({ field: { onChange, value } }) => (
//                 <View
//                   className={cn(
//                     "flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 h-14",
//                     errors.amount && "border-red-500 bg-red-50/10",
//                   )}
//                 >
//                   <DollarSign
//                     size={20}
//                     color={errors.amount ? "#ef4444" : "#94a3b8"}
//                   />
//                   <TextInput
//                     className="flex-1 ml-2 text-slate-900 font-bold text-lg"
//                     placeholder="1,000,000"
//                     keyboardType="numeric"
//                     value={value?.toString()}
//                     onChangeText={(text) => {
//                       const cleaned = text.replace(/[^0-9]/g, "");
//                       onChange(cleaned === "" ? "" : Number(cleaned));
//                     }}
//                   />
//                 </View>
//               )}
//             />
//             {errors.amount && (
//               <Text className="text-red-500 text-[10px] mt-1 ml-2 font-medium">
//                 {errors.amount.message as string}
//               </Text>
//             )}
//           </View>

//           {/* Date Input */}
//           <View className="mb-4">
//             <Text className="text-slate-500 text-xs font-bold mb-2 uppercase ml-1">
//               Ngày hoàn trả
//             </Text>
//             <Controller
//               control={control}
//               name="returnDate"
//               render={({ field: { onChange, value } }) => (
//                 <View
//                   className={cn(
//                     "flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 h-14",
//                     errors.returnDate && "border-red-500 bg-red-50/10",
//                   )}
//                 >
//                   <Calendar
//                     size={20}
//                     color={errors.returnDate ? "#ef4444" : "#94a3b8"}
//                   />
//                   <TextInput
//                     className="flex-1 ml-2 text-slate-900"
//                     placeholder="YYYY-MM-DD"
//                     value={value}
//                     onChangeText={onChange}
//                   />
//                 </View>
//               )}
//             />
//             {errors.returnDate && (
//               <Text className="text-red-500 text-[10px] mt-1 ml-2 font-medium">
//                 {errors.returnDate.message as string}
//               </Text>
//             )}
//           </View>

//           {/* Reason Input */}
//           <View className="mb-8">
//             <Text className="text-slate-500 text-xs font-bold mb-2 uppercase ml-1">
//               Lý do
//             </Text>
//             <Controller
//               control={control}
//               name="reason"
//               render={({ field: { onChange, value } }) => (
//                 <TextInput
//                   className={cn(
//                     "bg-slate-50 border border-slate-100 rounded-2xl p-4 h-28 text-slate-900",
//                     errors.reason && "border-red-500 bg-red-50/10",
//                   )}
//                   placeholder="Nhập nội dung..."
//                   multiline
//                   textAlignVertical="top"
//                   value={value}
//                   onChangeText={onChange}
//                 />
//               )}
//             />
//             {errors.reason && (
//               <Text className="text-red-500 text-[10px] mt-1 ml-2 font-medium">
//                 {errors.reason.message as string}
//               </Text>
//             )}
//           </View>

//           <View className={`${Platform.OS === "ios" ? "pb-5" : ""}`}>
//             <TouchableOpacity
//               disabled={loading}
//               onPress={onSubmit}
//               className={cn(
//                 "h-16 rounded-2xl items-center justify-center shadow-lg shadow-violet-200",
//                 loading ? "bg-violet-400" : "bg-violet-600",
//               )}
//             >
//               {loading ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text className="text-white font-extrabold text-lg">
//                   Gửi yêu cầu ngay
//                 </Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </View>
//     </Modal>
//   );
// }

// export default React.memo(CreateRequestModal);

import { BottomSheet } from "@/components/BottomSheet";
import { cn } from "@/libs/cn";
import { Calendar, DollarSign, X } from "lucide-react-native";
import { Controller } from "react-hook-form";
import {
  ActivityIndicator,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateRequestModal({
  visible,
  loading,
  control,
  errors,
  onClose,
  onSubmit,
}: any) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <BottomSheet.Overlay />
      {/* HEADER SLOT */}
      <BottomSheet.Content heightPercentage={0.56}>
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold text-slate-900">Tạo yêu cầu</Text>
          <TouchableOpacity
            disabled={loading}
            onPress={onClose}
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
                  errors.amount && "border-red-500 bg-red-50/10",
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
              {errors.amount.message as string}
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
                  errors.returnDate && "border-red-500 bg-red-50/10",
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
              {errors.returnDate.message as string}
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
                  errors.reason && "border-red-500 bg-red-50/10",
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
              {errors.reason.message as string}
            </Text>
          )}
        </View>

        <View className={`${Platform.OS === "ios" ? "pb-5" : ""}`}>
          <TouchableOpacity
            disabled={loading}
            onPress={onSubmit}
            className={cn(
              "h-16 rounded-2xl items-center justify-center shadow-lg shadow-violet-200",
              loading ? "bg-violet-400" : "bg-violet-600",
            )}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-extrabold text-lg">
                Gửi yêu cầu ngay
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </BottomSheet.Content>
    </BottomSheet>
  );
}
