import { Check } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Checkbox({
  label,
  value,
  onChange,
}: {
  label?: string;
  value?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const [internalValue, setInternalValue] = useState(value ?? false);

  const toggle = () => {
    const newValue = !internalValue;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <Pressable
      onPress={toggle}
      className="flex-row items-center space-x-2 py-2"
    >
      <View
        className={`w-6 h-6 rounded-md border-2 mr-2
        ${internalValue ? "bg-blue-500 border-blue-500" : "border-gray-400"}
        items-center justify-center`}
      >
        {internalValue && <Check size={18} color="white" />}
      </View>

      {label && <Text className="text-base text-gray-800">{label}</Text>}
    </Pressable>
  );
}
