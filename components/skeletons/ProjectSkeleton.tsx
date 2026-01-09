import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

const ProjectSkeleton = () => {
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
          className="h-6 w-20 rounded-full bg-gray-200"
          style={{ opacity }}
        />
        <Animated.View
          className="h-4 w-24 bg-gray-200 rounded"
          style={{ opacity }}
        />
      </View>

      {/* Title */}
      <Animated.View
        className="h-6 w-3/4 bg-gray-200 rounded mb-2"
        style={{ opacity }}
      />
      
      {/* Description */}
      <View className="mb-3 space-y-2">
        <Animated.View
          className="h-4 w-full bg-gray-200 rounded"
          style={{ opacity }}
        />
        <Animated.View
          className="h-4 w-2/3 bg-gray-200 rounded"
          style={{ opacity }}
        />
      </View>

      {/* Progress Bar */}
      <View className="mb-3">
        <View className="flex-row justify-between mb-1">
          <Animated.View
            className="h-3 w-12 bg-gray-200 rounded"
            style={{ opacity }}
          />
          <Animated.View
            className="h-3 w-8 bg-gray-200 rounded"
            style={{ opacity }}
          />
        </View>
        <Animated.View
          className="h-2 w-full bg-gray-200 rounded-full"
          style={{ opacity }}
        />
      </View>

      {/* Stats */}
      <View className="flex-row items-center border-t border-gray-50 pt-3 justify-between">
        <Animated.View
          className="h-4 w-16 bg-gray-200 rounded"
          style={{ opacity }}
        />

        <View className="flex-row -space-x-2">
          <Animated.View
            className="w-6 h-6 rounded-full bg-gray-200 border border-white"
            style={{ opacity }}
          />
          <Animated.View
            className="w-6 h-6 rounded-full bg-gray-200 border border-white"
            style={{ opacity }}
          />
          <Animated.View
            className="w-6 h-6 rounded-full bg-gray-200 border border-white"
            style={{ opacity }}
          />
        </View>
      </View>
    </View>
  );
};

export default ProjectSkeleton;
