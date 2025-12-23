import { useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [text, setText] = useState<{desc: string, name: string}>({
    desc: "Hello",
    name: "",
  });
  const handleChangeText = () => {
    setText({
      desc: "I'm",
      name: "Le Anh Kiet",
    });
  };
  useEffect(() => {
    setText({
    desc: "Hello",
    name: "",
  })
  }, [])
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 flex-col items-center justify-center">
        <Text className="text-2xl font-bold text-[#475467] text-center px-8 pb-10">
          My Firt App
        </Text>
        <View className="flex flex-col items-center justify-center pb-10">
          <Text>{text.desc}</Text>
          <Text className="font-bold">{text.name}</Text>
        </View>
        <TouchableOpacity
          onPress={handleChangeText}
          className="flex flex-row items-center justify-center w-44 h-12 max-w-md bg-[#8862F2] rounded-lg shadow-lg"
        >
          <Text className="text-center text-lg font-medium text-white">
            Say Hi!
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
