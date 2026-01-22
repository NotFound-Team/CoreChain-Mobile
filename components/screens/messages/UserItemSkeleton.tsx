import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

const UserItemSkeleton = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100 w-full">
      {/* Avatar */}
      <Animated.View
        className="w-10 h-10 rounded-full bg-gray-200"
        style={{ opacity }}
      />

      {/* Name */}
      <Animated.View
        className="ml-3 h-4 w-40 rounded bg-gray-200"
        style={{ opacity }}
      />
    </View>
  );
};

export default UserItemSkeleton;
