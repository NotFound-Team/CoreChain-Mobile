import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      setTimeout(() => {
        setShow(false);
        onClose();
      }, 3000);
    }
  }, [isVisible, onClose]);

  const getToastStyle = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "info":
        return "bg-blue-500 text-white";
      default:
        return "";
    }
  };

  return (
    show && (
      <View
        className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md transition-opacity duration-300 ${getToastStyle()}`}
      >
        <Text>{message}</Text>
      </View>
    )
  );
};

export default Toast;
