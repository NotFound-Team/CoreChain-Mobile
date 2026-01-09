import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const personalDataSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  position: z.string().min(1, "Position is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  fullAddress: z.string().min(5, "Address must be at least 5 characters"),
});

type PersonalDataForm = z.infer<typeof personalDataSchema>;
const Personal = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalDataForm>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      firstName: "Tonald",
      lastName: "Drump",
      dob: "10 December 1997",
      position: "Junior Full Stack Developer",
      country: "Indonesia",
      state: "DKI Jakarta",
      city: "Jakarta Selatan",
      fullAddress: "Jl Mampang Prapatan XIV No 7A, Jakarta Selatan 12790",
    },
  });

  const onSubmit = (data: PersonalDataForm) => {
    console.log("Form Data:", data);
  };

  // Component tái sử dụng cho Input
  const FormInput = ({
    label,
    name,
    icon,
    isDropdown = false,
    multiline = false,
  }: any) => (
    <View className="mb-4">
      <Text className="text-slate-500 text-xs font-semibold mb-2">{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <View
            className={`flex-row items-center border ${errors[name] ? "border-red-500" : "border-slate-200"} rounded-xl px-4 py-3 bg-white`}
          >
            <Ionicons name={icon} size={18} color="#8B5CF6" className="mr-3" />
            <TextInput
              className="flex-1 text-slate-800 text-[14px]"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline={multiline}
              textAlignVertical={multiline ? "top" : "center"}
              placeholder={`Enter ${label.toLowerCase()}`}
            />
            {isDropdown && (
              <Ionicons name="chevron-down" size={18} color="#8B5CF6" />
            )}
          </View>
        )}
      />
      {errors[name] && (
        <Text className="text-red-500 text-[10px] mt-1">
          {errors[name]?.message}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 flex-row items-center border-b border-slate-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-[#F3F0FF]"
        >
          <Ionicons name="chevron-back" size={24} color="#8862F2" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-slate-800 mr-8">
          Personal Data
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="p-5">
          {/* Section: My Personal Data */}
          <View className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-5">
            <Text className="font-bold text-slate-900">My Personal Data</Text>
            <Text className="text-slate-400 text-xs mb-6">
              Details about my personal data
            </Text>

            {/* Avatar Upload */}
            <View className="items-center mb-8">
              <View className="relative">
                <View className="w-24 h-24 bg-purple-100 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                  <Image
                    source={{ uri: "https://i.pravatar.cc/150?u=tonald" }}
                    className="w-full h-full"
                  />
                </View>
                <TouchableOpacity className="absolute -top-2 -right-2 bg-purple-600 p-1.5 rounded-full border-2 border-white">
                  <Ionicons name="sync" size={14} color="white" />
                </TouchableOpacity>
              </View>
              <Text className="mt-3 font-bold text-slate-700 text-xs">
                Upload Photo
              </Text>
              <Text className="text-[10px] text-slate-400 text-center mt-1">
                Format should be in .jpeg .png atleast{"\n"}800x800px and less
                than 5MB
              </Text>
            </View>

            <FormInput
              label="First Name"
              name="firstName"
              icon="person-outline"
            />
            <FormInput
              label="Last Name"
              name="lastName"
              icon="person-outline"
            />
            <FormInput
              label="Date of Birth"
              name="dob"
              icon="calendar-outline"
              isDropdown
            />
            <FormInput
              label="Position"
              name="position"
              icon="briefcase-outline"
              isDropdown
            />
          </View>

          {/* Section: Address */}
          <View className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-10">
            <Text className="font-bold text-slate-900">Address</Text>
            <Text className="text-slate-400 text-xs mb-6">
              Your current domicile
            </Text>

            <FormInput
              label="Country"
              name="country"
              icon="checkmark-circle-outline"
              isDropdown
            />
            <FormInput
              label="State"
              name="state"
              icon="checkmark-circle-outline"
              isDropdown
            />
            <FormInput
              label="City"
              name="city"
              icon="checkmark-circle-outline"
              isDropdown
            />
            <FormInput
              label="Full Address"
              name="fullAddress"
              icon="none"
              multiline
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View className="p-5 bg-white border-t border-slate-100">
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-purple-600 py-4 rounded-full shadow-lg shadow-purple-300 items-center"
        >
          <Text className="text-white font-bold text-base">Update</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Personal;
