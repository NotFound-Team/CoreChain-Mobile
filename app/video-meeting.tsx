import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

const VideoMeeting = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#1A1A1A]">
      <StatusBar barStyle="light-content" />
      
      {/* Top Header */}
      <View className="px-6 py-4 flex-row justify-between items-center">
        <View className="bg-white/10 px-4 py-2 rounded-2xl flex-row items-center border border-white/5">
          <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
          <Text className="text-white font-semibold text-[12px]">REC 12:45</Text>
        </View>
        
        <View className="flex-row space-x-3">
          <TouchableOpacity className="bg-white/10 p-3 rounded-2xl">
            <Ionicons name="camera-reverse-outline" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-white/10 p-3 rounded-2xl">
            <Ionicons name="people-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Video Grid */}
      <View className="flex-1 px-4 py-2">
        <View className="flex-1 flex-row flex-wrap justify-between">
          
          {/* User 1 - Me */}
          <View className="w-[48%] h-[48%] bg-zinc-800 rounded-3xl mb-[4%] overflow-hidden relative">
            <Image 
              source={{ uri: 'https://i.pravatar.cc/300?u=me' }} 
              className="w-full h-full opacity-90"
            />
            <View className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-full flex-row items-center">
              <Text className="text-white text-[10px] font-medium">You</Text>
            </View>
          </View>

          {/* User 2 */}
          <View className="w-[48%] h-[48%] bg-zinc-800 rounded-3xl mb-[4%] overflow-hidden relative border-2 border-purple-500">
            <Image 
              source={{ uri: 'https://i.pravatar.cc/300?u=jane' }} 
              className="w-full h-full"
            />
            <View className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-full">
              <Text className="text-white text-[10px] font-medium">Jane Doe</Text>
            </View>
            <View className="absolute top-3 right-3 bg-purple-500 p-1.5 rounded-full">
              <Ionicons name="mic" size={12} color="white" />
            </View>
          </View>

          {/* User 3 */}
          <View className="w-[48%] h-[48%] bg-zinc-800 rounded-3xl overflow-hidden relative">
            <Image 
              source={{ uri: 'https://i.pravatar.cc/300?u=alex' }} 
              className="w-full h-full opacity-80"
            />
            <View className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-full">
              <Text className="text-white text-[10px] font-medium">Alex Smith</Text>
            </View>
            <View className="absolute top-3 right-3 bg-red-500 p-1.5 rounded-full">
              <Ionicons name="mic-off" size={12} color="white" />
            </View>
          </View>

          {/* User 4 - Team */}
          <View className="w-[48%] h-[48%] bg-zinc-800 rounded-3xl overflow-hidden relative items-center justify-center">
             <View className="bg-zinc-700 w-16 h-16 rounded-full items-center justify-center">
                <Text className="text-white font-bold text-xl">+8</Text>
             </View>
             <View className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-full">
              <Text className="text-white text-[10px] font-medium">Team Marketing</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Controls */}
      <View className="bg-[#2A2A2A] mx-6 mb-8 p-4 rounded-[35px] flex-row justify-between items-center shadow-2xl border border-white/5">
        <TouchableOpacity className="w-12 h-12 bg-white/10 rounded-full items-center justify-center">
          <Ionicons name="mic-outline" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity className="w-12 h-12 bg-white/10 rounded-full items-center justify-center">
          <Ionicons name="videocam-outline" size={24} color="white" />
        </TouchableOpacity>

        {/* End Call Button */}
        <TouchableOpacity className="w-16 h-16 bg-red-500 rounded-full items-center justify-center shadow-lg shadow-red-500/50">
          <Ionicons name="call" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity className="w-12 h-12 bg-white/10 rounded-full items-center justify-center">
          <Ionicons name="call" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity className="w-12 h-12 bg-white/10 rounded-full items-center justify-center">
          <Ionicons name="ellipsis-horizontal" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VideoMeeting;