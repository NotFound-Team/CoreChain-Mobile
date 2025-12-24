import { Eye, EyeOff } from "lucide-react-native";
import { memo, ReactNode, useState } from "react";
import { Pressable, TextInput, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  secure?: boolean;
  className?: string;
  keyboardType?: TextInputProps["keyboardType"];
}

const Input = memo(function Input({
  leftIcon,
  rightIcon,
  secure = false,
  placeholder,
  value,
  onChangeText,
  className = "",
  keyboardType,
  ...rest
}: InputProps) {
  const [isSecure, setIsSecure] = useState(secure);

  return (
    <View
      className={`flex-row items-center px-3 py-2 rounded-xl border border-gray-300 bg-white ${className}`}
    >
      {leftIcon && <View className="mr-2">{leftIcon}</View>}

      <TextInput
        className="flex-1 text-base text-gray-800 h-auto w-auto"
        placeholder={placeholder}
        secureTextEntry={isSecure}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor="#999"
        {...rest}
      />

      {secure ? (
        <Pressable onPress={() => setIsSecure(!isSecure)}>
          {!isSecure ? (
            <Eye size={20} color="#666" />
          ) : (
            <EyeOff size={20} color="#666" />
          )}
        </Pressable>
      ) : (
        rightIcon && <View className="ml-2">{rightIcon}</View>
      )}
    </View>
  );
});

export default Input;
