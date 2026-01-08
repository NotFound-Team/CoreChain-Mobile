import { Skeleton } from "moti/skeleton";
import React from "react";
import { View } from "react-native";

const skeletonProps = {
  colorMode: "light" as const,
  transition: { type: "timing" as const, duration: 1500 },
  backgroundColor: "#F1F5F9",
};

export const TaskItemSkeleton = () => {
  return (
    <View className="bg-white mx-4 mb-4 p-4 rounded-[20px] shadow-sm border border-gray-50">
      {/* Header: Icon & Title */}
      <View className="flex-row items-center mb-3">
        <Skeleton radius="round" height={40} width={40} {...skeletonProps} />
        <View className="ml-3 flex-1">
          <Skeleton height={20} width="70%" {...skeletonProps} />
        </View>
      </View>

      {/* Badges: Status & Priority */}
      <View className="flex-row mb-4">
        <Skeleton radius={20} height={24} width={80} {...skeletonProps} />
        <View className="ml-2">
          <Skeleton radius={20} height={24} width={70} {...skeletonProps} />
        </View>
      </View>

      {/* Progress Bar Placeholder */}
      <View className="mb-4">
        <Skeleton radius={10} height={6} width="100%" {...skeletonProps} />
      </View>

      {/* Footer: Avatars & Info */}
      <View className="flex-row justify-between items-center">
        {/* Avatars group */}
        <View className="flex-row">
          <Skeleton radius="round" height={28} width={28} {...skeletonProps} />
          <View className="-ml-2">
            <Skeleton
              radius="round"
              height={28}
              width={28}
              {...skeletonProps}
            />
          </View>
        </View>

        {/* Date & Comments placeholders */}
        <View className="flex-row items-center">
          <Skeleton radius={8} height={24} width={60} {...skeletonProps} />
          <View className="ml-2">
            <Skeleton radius={8} height={24} width={40} {...skeletonProps} />
          </View>
        </View>
      </View>
    </View>
  );
};
