import DepartmentSkeleton from "@/components/skeletons/DepartmentSkeleton";
import { getDepartments } from "@/services/department.service";
import { getUserDetails, getUserIds } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth-store";
import { IDepartment } from "@/types/department";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UserDetailModal from "./UserDetailModal";

export default function Department() {
  const router = useRouter();
  const [department, setDepartment] = useState<IDepartment | null>(null);
  const [managerProfile, setManagerProfile] = useState<any>(null);
  const [employeeProfiles, setEmployeeProfiles] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // 1. Find user's department
      const isManager = user?.roleName?.toLowerCase() === "manager";
      const params = isManager
        ? { manager: user?.id }
        : { employees: user?.id };

      const listRes = await getDepartments(params);
      if (!listRes.isError && listRes.data.result.length > 0) {
        const deptId = listRes.data.result[0]._id;
        // 2. Get full detail
        const { getDetailDepartment } =
          await import("@/services/department.service");
        const detailRes = await getDetailDepartment(deptId);
        if (!detailRes.isError) {
          const dept = detailRes.data;
          setDepartment(dept);

          // 3. Fetch parallel manager and employees
          const managerId =
            typeof dept.manager === "string"
              ? dept.manager
              : (dept.manager as any)?._id || dept.manager;

          const managerPromise = managerId
            ? getUserDetails(managerId)
            : Promise.resolve(null);

          const employeesPromise =
            Array.isArray(dept.employees) && dept.employees.length > 0
              ? getUserIds(dept.employees)
              : Promise.resolve(null);

          const projectsPromise =
            Array.isArray(dept.projectIds) && dept.projectIds.length > 0
              ? (async () => {
                  const { getProjectDetail } =
                    await import("@/services/project.service");

                  const projects = await Promise.all(
                    dept.projectIds.map(async (id: string) => {
                      const res = await getProjectDetail(id);
                      return res.isError ? null : res.data;
                    }),
                  );

                  return projects.filter(Boolean);
                })()
              : Promise.resolve([]);

          const [mRes, resEmployees, projects] = await Promise.all([
            managerPromise,
            employeesPromise,
            projectsPromise,
          ]);

          if (mRes && !mRes.isError) {
            setManagerProfile(mRes.data);
          }

          if (resEmployees && !resEmployees.isError) {
            setEmployeeProfiles(resEmployees.data);
          }

          if (projects.length > 0) {
            setProjects(projects);
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  console.log("Department Data:", department);

  const handleCloseModal = useCallback(() => {
    setIsUserModalVisible(false);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-4 pb-4 flex-row items-center border-b border-gray-100 bg-white">
        <View className="w-10 h-10 items-center justify-center rounded-2xl bg-indigo-50 mr-3">
          <Ionicons name="business" size={20} color="#4F46E5" />
        </View>
        <Text className="text-xl font-bold text-gray-900">My Department</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchData}
            tintColor="#4F46E5"
          />
        }
      >
        {isLoading ? (
          <View className="p-6">
            <DepartmentSkeleton />
          </View>
        ) : !department ? (
          <View className="flex-1 justify-center items-center pt-20">
            <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="business-outline" size={40} color="#9CA3AF" />
            </View>
            <Text className="text-gray-500 font-medium">
              No department found
            </Text>
            <Text className="text-gray-400 text-xs mt-1 text-center px-10">
              You are not assigned to any department yet.
            </Text>
          </View>
        ) : (
          <View className="p-6">
            {/* Dept Hero Card */}
            <View className="bg-indigo-600 p-6 rounded-[32px] mb-8 shadow-xl shadow-indigo-200">
              <View className="flex-row justify-between items-start mb-6">
                <View>
                  <Text className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">
                    Department Code: {department.code}
                  </Text>
                  <Text className="text-white text-3xl font-bold leading-tight">
                    {department.name}
                  </Text>
                </View>
                <View className="bg-white/20 p-3 rounded-2xl">
                  <Ionicons name="medal" size={24} color="white" />
                </View>
              </View>

              <View className="flex-row items-center bg-white/10 p-4 rounded-2xl">
                <Ionicons name="time-outline" size={16} color="#E0E7FF" />
                <Text className="text-indigo-50 ml-2 text-xs font-medium">
                  Active since {dayjs(department.createdAt).format("MMMM YYYY")}
                </Text>
              </View>
            </View>

            {/* Quick Stats */}
            <View className="flex-row gap-4 mb-8">
              <View className="flex-1 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                <Text className="text-gray-400 text-[10px] font-bold uppercase mb-2">
                  Budget
                </Text>
                <Text className="text-gray-900 font-bold text-lg">
                  ${department.budget?.toLocaleString() || "0"}
                </Text>
              </View>
              <View className="flex-1 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                <Text className="text-gray-400 text-[10px] font-bold uppercase mb-2">
                  Status
                </Text>
                <View className="flex-row items-center">
                  <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                  <Text className="text-gray-900 font-bold text-lg capitalize">
                    {department.status || "Active"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Description Card */}
            <View className="mb-8">
              <Text className="text-lg font-bold text-gray-900 mb-4 ml-1">
                About
              </Text>
              <View className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <Text className="text-gray-500 leading-6 text-[15px]">
                  {department.description ||
                    "Our department focuses on driving innovation and delivering excellence across all CoreChain initiatives."}
                </Text>
              </View>
            </View>

            {/* Manager info */}
            <View className="mb-8">
              <Text className="text-lg font-bold text-gray-900 mb-4 ml-1">
                Department Head
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedUser(managerProfile);
                  setIsUserModalVisible(true);
                }}
                className="flex-row items-center bg-gray-50 p-4 rounded-3xl border border-gray-100"
              >
                <View className="w-14 h-14 bg-indigo-100 rounded-2xl items-center justify-center mr-4 overflow-hidden">
                  {managerProfile?.avatar ? (
                    <Image
                      source={{ uri: managerProfile.avatar }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  ) : (
                    <Ionicons name="person" size={28} color="#4F46E5" />
                  )}
                </View>
                <View>
                  <Text className="text-gray-900 font-bold text-base">
                    {managerProfile?.name || "Head of Department"}
                  </Text>
                  <Text className="text-gray-400 text-xs">
                    {managerProfile?.email || "manager@corechain.com"}
                  </Text>
                </View>
                <View className="ml-auto bg-white p-2 rounded-xl">
                  <Ionicons name="chevron-forward" size={16} color="#4F46E5" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Team Members */}
            <View className="mb-8">
              <Text className="text-lg font-bold text-gray-900 mb-4 ml-1">
                Team Members
              </Text>
              <View className="flex-row flex-wrap gap-4">
                {employeeProfiles.length > 0 ? (
                  employeeProfiles.map((emp, idx) => (
                    <TouchableOpacity
                      key={emp._id || idx}
                      onPress={() => {
                        setSelectedUser(emp);
                        setIsUserModalVisible(true);
                      }}
                      className="w-[100px] items-center"
                    >
                      <View className="w-16 h-16 bg-white rounded-[20px] p-1 shadow-sm border border-gray-100 mb-2">
                        <View className="w-full h-full rounded-[18px] bg-gray-100 overflow-hidden items-center justify-center">
                          {emp.avatar ? (
                            <Image
                              source={{ uri: emp.avatar }}
                              style={{ width: "100%", height: "100%" }}
                              contentFit="cover"
                            />
                          ) : (
                            <Ionicons name="person" size={24} color="#9CA3AF" />
                          )}
                        </View>
                      </View>
                      <Text
                        className="text-gray-700 text-[11px] font-bold text-center"
                        numberOfLines={1}
                      >
                        {emp.name?.split(" ")[0]}
                      </Text>
                      <Text
                        className="text-gray-400 text-[9px] text-center"
                        numberOfLines={1}
                      >
                        {typeof emp.position === "object"
                          ? emp.position.title
                          : emp.position || "Member"}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text className="text-gray-400 text-xs italic ml-1">
                    No team members found.
                  </Text>
                )}
              </View>
            </View>

            {/* Department Projects */}
            <View className="mb-8">
              <Text className="text-lg font-bold text-gray-900 mb-4 ml-1">
                Projects
              </Text>
              <View className="space-y-4">
                {projects.length > 0 ? (
                  projects.map((proj, idx) => (
                    <TouchableOpacity
                      key={proj._id || idx}
                      onPress={() =>
                        router.push(`/project-details/${proj._id}`)
                      }
                      className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm"
                    >
                      <View className="flex-row justify-between items-center mb-3">
                        <View className="flex-1">
                          <Text
                            className="text-gray-900 font-bold text-base mb-1"
                            numberOfLines={1}
                          >
                            {proj.name}
                          </Text>
                          <View className="flex-row items-center">
                            <Ionicons
                              name="calendar-outline"
                              size={12}
                              color="#9CA3AF"
                            />
                            <Text className="text-gray-400 text-[10px] ml-1">
                              {dayjs(proj.startDate).format("MMM DD")} -{" "}
                              {dayjs(proj.endDate).format("MMM DD, YYYY")}
                            </Text>
                          </View>
                        </View>
                        <View className="bg-indigo-50 px-3 py-1.5 rounded-xl">
                          <Text className="text-indigo-600 font-bold text-[10px]">
                            {proj.progress?.toFixed(0) || 0}%
                          </Text>
                        </View>
                      </View>

                      {/* Progress Bar */}
                      <View className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
                        <View
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${proj.progress || 0}%` }}
                        />
                      </View>

                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Ionicons
                            name="layers-outline"
                            size={14}
                            color="#6B7280"
                          />
                          <Text className="text-gray-500 text-xs ml-1">
                            {proj.tasks?.length || 0} Tasks
                          </Text>
                        </View>
                        <View className="flex-row items-center bg-green-50 px-2 py-0.5 rounded-lg">
                          <Ionicons
                            name="cash-outline"
                            size={12}
                            color="#10B981"
                          />
                          <Text className="text-green-600 text-[10px] font-bold ml-1">
                            ${proj.revenue?.toLocaleString() || 0}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View className="bg-gray-50 p-6 rounded-3xl items-center border border-dashed border-gray-200">
                    <Ionicons
                      name="folder-open-outline"
                      size={32}
                      color="#D1D5DB"
                    />
                    <Text className="text-gray-400 text-xs mt-2">
                      No active projects found.
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Footer Summary */}
            <View className="flex-row items-center justify-between bg-indigo-50 p-6 rounded-[28px]">
              <View className="flex-1">
                <Text className="text-indigo-900 font-bold text-lg mb-1">
                  {employeeProfiles.length} Team Members
                </Text>
                <Text className="text-indigo-600 text-xs">
                  Working on {projects.length} active projects
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* User Detail Modal */}
      <UserDetailModal
        onClose={handleCloseModal}
        userData={selectedUser}
        visible={isUserModalVisible}
      />
    </SafeAreaView>
  );
}
