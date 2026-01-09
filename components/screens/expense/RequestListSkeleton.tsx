import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import React from "react";
import { View } from "react-native";

const skeletonProps = {
  colorMode: "light" as const,
  transition: {
    type: "timing" as const,
    duration: 1500,
  },
  backgroundColor: "#F1F5F9",
};

const RequestCardSkeleton = () => (
  <View className="bg-white rounded-3xl p-4 mb-4 border border-slate-50 shadow-sm">
    <View className="flex-row items-center justify-between mb-4">
      <View className="flex-row items-center gap-3">
        <Skeleton radius="round" height={44} width={44} {...skeletonProps} />

        <View className="gap-2">
          <Skeleton height={22} width={140} {...skeletonProps} />
          <Skeleton height={12} width={70} {...skeletonProps} />
        </View>
      </View>
    </View>

    <View className="bg-slate-50 p-3 rounded-2xl mb-4">
      <View className="gap-2">
        <Skeleton height={14} width={"100%"} {...skeletonProps} />
        <Skeleton height={14} width={"60%"} {...skeletonProps} />
      </View>
    </View>

    <View className="flex-row justify-between border-t border-slate-50 pt-3">
      <Skeleton height={12} width={110} {...skeletonProps} />
      <Skeleton height={12} width={90} {...skeletonProps} />
    </View>
  </View>
);

export const RequestListSkeleton = () => {
  return (
    <MotiView
      from={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ type: "timing", duration: 500 }}
      className="flex-1 p-4"
    >
      {[1, 2, 3, 4].map((key) => (
        <RequestCardSkeleton key={key} />
      ))}
    </MotiView>
  );
};
