import { uploadFile } from "@/services/file.service";
import { getUserDetails, updatePublicUser } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth-store";
import { PublicUser } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const UpdateProfile = () => {
  const { user, setUser } = useAuthStore();
  const [userData, setUserData] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [avatarUri, setAvatarUri] = useState("");
  const [saving, setSaving] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        try {
          const res = await getUserDetails(user.id);
          if (res.data) {
            setUserData(res.data);
            setName(res.data.name);
            setAvatarUri(res.data.avatar || user.avatar || "");
          }
        } catch (error) {
          console.error("Error fetching public user details:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!user?.id || !userData) return;
    setSaving(true);

    try {
      let newAvatarUrl = userData.avatar;

      // Check if avatar has changed (simple check: if it's a file uri, it's new)
      if (
        avatarUri &&
        avatarUri !== userData.avatar &&
        !avatarUri.startsWith("http")
      ) {
        // Upload file
        const file = {
          uri: avatarUri,
          fileName: `avatar_${user.id}_${Date.now()}.jpg`,
          mimeType: "image/jpeg",
        };

        const uploadRes = await uploadFile(file);
        if (uploadRes.data) {
          newAvatarUrl = uploadRes.data.url;
        }
      }

      await updatePublicUser(user.id, {
        name: name,
        avatar: newAvatarUrl,
      });
      setUser({ name: name, avatar: newAvatarUrl });

      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#8862F2" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View
        className="bg-white px-6 py-4 flex-row items-center border-b border-slate-100"
        style={{ paddingTop: insets.top + 16 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-[#F3F0FF]"
        >
          <Ionicons name="chevron-back" size={24} color="#8862F2" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-slate-800 mr-8">
          Update Public Profile
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="p-5">
          <View className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-5">
            {/* Avatar */}
            <View className="items-center mb-8 mt-2">
              <TouchableOpacity
                onPress={pickImage}
                className="w-32 h-32 bg-purple-100 rounded-full overflow-hidden border-4 border-white shadow-sm relative"
              >
                <Image
                  source={{
                    uri: avatarUri || "https://i.pravatar.cc/150",
                  }}
                  className="w-full h-full"
                />
                <View className="absolute inset-0 bg-black/30 items-center justify-center">
                  <Ionicons name="camera" size={32} color="white" />
                </View>
              </TouchableOpacity>
              <Text className="text-xs text-slate-400 mt-3">
                Tap to change avatar
              </Text>
            </View>

            {/* Name Input */}
            <View className="mb-4">
              <Text className="text-slate-500 text-xs font-semibold mb-2">
                Full Name
              </Text>
              <View className="flex-row items-center border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:border-[#8862F2]">
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#8B5CF6"
                  className="mr-3"
                />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  className="flex-1 text-slate-800 text-[16px]"
                  placeholder="Enter full name"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              className="mt-6 bg-[#8862F2] py-4 rounded-xl items-center shadow-lg shadow-purple-200"
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default UpdateProfile;
