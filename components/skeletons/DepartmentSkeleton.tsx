import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

const DepartmentSkeleton = () => {
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
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <View className="bg-white p-4 rounded-2xl mb-3 border border-gray-100 shadow-sm">
      {/* Header */}
      <View className="flex-row justify-between items-start mb-2">
        <Animated.View
          className="h-6 w-12 rounded-full bg-gray-200"
          style={{ opacity }}
        />
        <Animated.View
          className="h-4 w-24 bg-gray-200 rounded"
          style={{ opacity }}
        />
      </View>

      {/* Name */}
      <Animated.View
        className="h-6 w-1/2 bg-gray-200 rounded mb-2"
        style={{ opacity }}
      />
      
      {/* Description */}
      <View className="mb-3 space-y-2">
        <Animated.View
          className="h-4 w-full bg-gray-200 rounded"
          style={{ opacity }}
        />
        <Animated.View
          className="h-4 w-3/4 bg-gray-200 rounded"
          style={{ opacity }}
        />
      </View>

      {/* Stats */}
      <View className="flex-row items-center gap-4 border-t border-gray-50 pt-3">
        <View className="flex-row items-center">
          <Animated.View
            className="w-4 h-4 bg-gray-200 rounded mr-1"
            style={{ opacity }}
          />
          <Animated.View
            className="h-3 w-16 bg-gray-200 rounded"
            style={{ opacity }}
          />
        </View>
        <View className="flex-row items-center">
          <Animated.View
            className="w-4 h-4 bg-gray-200 rounded mr-1"
            style={{ opacity }}
          />
          <Animated.View
            className="h-3 w-16 bg-gray-200 rounded"
            style={{ opacity }}
          />
        </View>
      </View>
    </View>
  );
};

export default DepartmentSkeleton;
