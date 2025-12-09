import { ScanQrCode, User } from "lucide-react-native";
import React, { useState } from "react";
import { Dimensions, Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Modal from "react-native-modal";
import Checkbox from "./Checkbox";
import Input from "./Input";

const screenHeight = Dimensions.get("window").height;
const modalHeight = screenHeight * (3 / 4);

const SignInModal = ({ isVisible, onClose }: any) => {
  const [isChecked, setIsChecked] = useState(false);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <Modal
      isVisible={isVisible}
      onSwipeComplete={onClose}
      swipeDirection={["down"]}
      onBackdropPress={onClose}
      style={{ margin: 0, justifyContent: "flex-end" }}
      propagateSwipe={true}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View
        key="center-line"
        style={{ height: modalHeight }}
        className="relative bg-white rounded-t-3xl pt-[40px] px-[32px] shadow-2xl"
      >
        <View className="absolute top-4 left-1/2 w-16 h-1 bg-gray-300 rounded-full mb-4" />
        <View className="items-center mb-6">
          <Text className="text-3xl font-bold text-gray-800">Sign In</Text>
          <Text className="text-[#475467] mt-1">Sign in to my account</Text>
        </View>

        <View className="mb-4">
          <Text className="text-lg text-[#475467] mb-2">Email</Text>
          <Input
            placeholder="My Email"
            keyboardType="email-address"
            leftIcon={<User color="#7A5AF8" />}
          />
        </View>

        <View className="mb-4">
          <Text className="text-lg text-[#475467] mb-2">Password</Text>
          <Input
            placeholder="My Password"
            secure
            leftIcon={<ScanQrCode color="#7A5AF8" />}
          />
        </View>
        <View className="mb-4 flex flex-row items-center justify-between">
          <Checkbox
            label="Remember Me"
            value={isChecked}
            onChange={setIsChecked}
          />
          <Text className="text-[#7A5AF8] ">Forgot Password?</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            console.log("Logging In...");
            onClose();
          }}
          className="flex items-center justify-center bg-violet-600 h-12 rounded-full shadow-lg"
        >
          <Text className="text-center text-lg font-medium text-white">
            Sign In
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity className="mt-4">
          
        </TouchableOpacity> */}
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SignInModal;
