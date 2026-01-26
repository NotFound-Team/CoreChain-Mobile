import {
  getPrivateUserDetails
} from "@/services/user.service";
import { useAuthStore } from "@/stores/auth-store";
import { CompleteUser } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Personal = () => {
  const { user } = useAuthStore();
  const [userData, setUserData] = useState<CompleteUser | null>(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        try {
          const res = await getPrivateUserDetails(user.id);
          if (res.data) {
            setUserData(res.data);
          }
        } catch (error) {
          console.error("Error fetching private user details:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [user?.id]);

  const InfoRow = ({ label, value, icon, isCurrency = false }: any) => (
    <View className="mb-4">
      <Text className="text-slate-500 text-xs font-semibold mb-2">{label}</Text>
      <View className="flex-row items-center border border-slate-100 rounded-xl px-4 py-3 bg-slate-50">
        <Ionicons name={icon} size={18} color="#8B5CF6" className="mr-3" />
        <Text className="flex-1 text-slate-800 text-[14px]">
          {isCurrency && typeof value === "number"
            ? `$${value.toLocaleString()}`
            : value || "N/A"}
        </Text>
      </View>
    </View>
  );

  const SectionTitle = ({
    title,
    subtitle,
  }: {
    title: string;
    subtitle: string;
  }) => (
    <View className="mb-4 mt-2">
      <Text className="font-extrabold text-slate-900 text-base">{title}</Text>
      <Text className="text-slate-400 text-xs">{subtitle}</Text>
    </View>
  );

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
          Personal Data
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="p-5">
          {/* Section: My Personal Data */}
          <View className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-5">
            <SectionTitle
              title="My Personal Data"
              subtitle="Details about my personal identity"
            />

            {/* Avatar */}
            <View className="items-center mb-8 mt-2">
              <View className="w-24 h-24 bg-purple-100 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                <Image
                  source={{
                    uri: userData?.avatar || "https://i.pravatar.cc/150",
                  }}
                  className="w-full h-full"
                />
              </View>
              <Text className="mt-3 font-bold text-slate-700 text-sm">
                {userData?.name}
              </Text>
              <Text className="text-xs text-slate-400 mt-1">
                {userData?.employeeId} - {userData?.position?.title}
              </Text>
            </View>

            <InfoRow
              label="Full Name"
              value={userData?.name}
              icon="person-outline"
            />
            <InfoRow
              label="Email Address"
              value={userData?.email}
              icon="mail-outline"
            />
            <InfoRow
              label="Date of Birth"
              value={
                userData?.dateOfBirth
                  ? new Date(userData.dateOfBirth).toLocaleDateString()
                  : "N/A"
              }
              icon="calendar-outline"
            />
            <InfoRow
              label="Gender"
              value={
                userData?.male === true
                  ? "Male"
                  : userData?.male === false
                    ? "Female"
                    : "N/A"
              }
              icon="person-outline"
            />
            <InfoRow
              label="Identification Number"
              value={userData?.personalIdentificationNumber}
              icon="card-outline"
            />
            <InfoRow
              label="Phone Number"
              value={userData?.personalPhoneNumber}
              icon="call-outline"
            />
            <InfoRow
              label="Nationality"
              value={userData?.nationality}
              icon="flag-outline"
            />
            <InfoRow
              label="Biometric Data"
              value={userData?.biometricData}
              icon="finger-print-outline"
            />
          </View>


          {/* Section: Employment */}
          <View className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-5">
            <SectionTitle
              title="Employment Details"
              subtitle="Contract and workplace information"
            />
            <InfoRow
              label="Department"
              value={userData?.department?.name}
              icon="business-outline"
            />
            <InfoRow
              label="Role"
              value={userData?.role?.name}
              icon="shield-checkmark-outline"
            />
            <InfoRow
              label="Contract Code"
              value={userData?.employeeContractCode}
              icon="document-text-outline"
            />
            <InfoRow
              label="Status"
              value={userData?.isActive ? "Active" : "Inactive"}
              icon="radioButtonOn-outline"
            />
          </View>

          {/* Section: Financial */}
          <View className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-5">
            <SectionTitle
              title="Financial Details"
              subtitle="Salary and banking information"
            />
            <View className="flex-row">
              <View className="flex-1 mr-2">
                <InfoRow
                  label="Base Salary"
                  value={userData?.salary}
                  icon="cash-outline"
                  isCurrency
                />
              </View>
              <View className="flex-1 ml-2">
                <InfoRow
                  label="Net Salary"
                  value={userData?.netSalary}
                  icon="wallet-outline"
                  isCurrency
                />
              </View>
            </View>
            <InfoRow
              label="Allowances"
              value={userData?.allowances}
              icon="add-circle-outline"
              isCurrency
            />
            <InfoRow
              label="Bank Account"
              value={userData?.backAccountNumber}
              icon="card-outline"
            />
            <InfoRow
              label="Tax ID"
              value={userData?.personalTaxIdentificationNumber}
              icon="receipt-outline"
            />
          </View>

          {/* Section: Health & Insurance */}
          <View className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-5">
            <SectionTitle
              title="Health & Insurance"
              subtitle="Medical records and insurance coverage"
            />
            <InfoRow
              label="Medical History"
              value={userData?.medicalHistory}
              icon="medical-outline"
            />
            <InfoRow
              label="Health Insurance"
              value={userData?.healthInsuranceCode}
              icon="medkit-outline"
            />
            <InfoRow
              label="Life Insurance"
              value={userData?.lifeInsuranceCode}
              icon="heart-outline"
            />
            <InfoRow
              label="Social Insurance"
              value={userData?.socialInsuranceNumber}
              icon="people-outline"
            />
            {userData?.healthCheckRecordCode &&
              userData.healthCheckRecordCode.length > 0 && (
                <InfoRow
                  label="Health Check Records"
                  value={userData.healthCheckRecordCode.join(", ")}
                  icon="list-outline"
                />
              )}
          </View>

          {/* Section: Address */}
          <View className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-10">
            <SectionTitle title="Address" subtitle="Your current domicile" />
            <InfoRow
              label="Permanent Address"
              value={userData?.permanentAddress}
              icon="location-outline"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Personal;
