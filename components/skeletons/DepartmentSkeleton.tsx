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
    <View className="flex-1">
      {/* Hero Card Skeleton */}
      <Animated.View
        className="h-44 w-full rounded-[32px] bg-gray-200 mb-8"
        style={{ opacity }}
      />

      {/* Stats Grid Skeleton */}
      <View className="flex-row gap-4 mb-8">
        <Animated.View
          className="flex-1 h-20 rounded-3xl bg-gray-100"
          style={{ opacity }}
        />
        <Animated.View
          className="flex-1 h-20 rounded-3xl bg-gray-100"
          style={{ opacity }}
        />
      </View>

      {/* About Section Skeleton */}
      <View className="mb-8">
        <Animated.View
          className="h-6 w-24 bg-gray-200 rounded mb-4"
          style={{ opacity }}
        />
        <Animated.View
          className="h-24 w-full bg-gray-50 rounded-3xl px-5 py-4"
          style={{ opacity }}
        />
      </View>

      {/* Department Head Skeleton */}
      <View className="mb-8">
        <Animated.View
           className="h-6 w-40 bg-gray-200 rounded mb-4"
           style={{ opacity }}
        />
        <View className="flex-row items-center bg-gray-50 p-4 rounded-3xl border border-gray-100">
           <Animated.View className="w-14 h-14 bg-gray-200 rounded-2xl mr-4" style={{ opacity }} />
           <View className="space-y-2">
              <Animated.View className="h-4 w-32 bg-gray-200 rounded" style={{ opacity }} />
              <Animated.View className="h-3 w-44 bg-gray-200 rounded" style={{ opacity }} />
           </View>
        </View>
      </View>

      {/* Team Members Skeleton */}
      <View className="mb-8">
        <Animated.View
           className="h-6 w-36 bg-gray-200 rounded mb-4"
           style={{ opacity }}
        />
        <View className="flex-row flex-wrap gap-4">
           {[1, 2, 3].map(i => (
              <View key={i} className="w-[100px] items-center">
                 <Animated.View className="w-16 h-16 bg-gray-100 rounded-[20px] mb-2" style={{ opacity }} />
                 <Animated.View className="h-3 w-12 bg-gray-100 rounded" style={{ opacity }} />
              </View>
           ))}
        </View>
      </View>

      {/* Projects Skeleton */}
      <View className="mb-8">
        <Animated.View
           className="h-6 w-24 bg-gray-200 rounded mb-4"
           style={{ opacity }}
        />
        <View className="space-y-4">
           {[1, 2].map(i => (
              <Animated.View 
                key={i}
                className="h-32 w-full rounded-[28px] bg-gray-50"
                style={{ opacity }}
              />
           ))}
        </View>
      </View>
    </View>
  );
};

export default DepartmentSkeleton;
