import { ApiResponse } from "@/types/api";
import { CreateFeedbackBody, UpdateFeedbackBody } from "@/types/feedback";



export const MOCK_FEEDBACKS = [
  {
    _id: "1",
    title: "Office Wi-Fi Connection",
    content: "The Wi-Fi connection on the 3rd floor has been very unstable lately. It drops frequently during video calls.",
    category: "Workplace",
    createdAt: new Date("2024-03-10T10:00:00"),
    isFlagged: false,
    wasDecrypted: false,
    encryptedEmployeeId: "enc_123", // simluate anonymous
  },
  {
    _id: "2",
    title: "New Coffee Machine",
    content: "Can we consider getting a new coffee machine for the pantry? The current one is often broken.",
    category: "General",
    createdAt: new Date("2024-03-12T14:30:00"),
    isFlagged: false,
    wasDecrypted: false,
  },
  {
    _id: "3",
    title: "Salary Slip Clarification",
    content: "I have a question regarding the tax deduction in my last salary slip. It seems higher than usual.",
    category: "Salary & Benefits",
    createdAt: new Date("2024-03-15T09:15:00"),
    isFlagged: false,
    wasDecrypted: false,
  },
  {
    _id: "4",
    title: "Manager Feedback",
    content: "I would like to give positive feedback for my manager who has been very supportive during the last project.",
    category: "Management",
    createdAt: new Date("2024-03-18T16:45:00"),
    isFlagged: false,
    wasDecrypted: false,
  },
];

export const getFeedbacks = async (
  params?: any
): Promise<ApiResponse<any>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return {
    isError: false,
    status: 200,
    data: {
      result: MOCK_FEEDBACKS,
    },
    message: "Success",
  };
};

export const createFeedback = async (data: CreateFeedbackBody): Promise<ApiResponse<any>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const newFeedback = {
    _id: Math.random().toString(36).substr(2, 9),
    ...data,
    createdAt: new Date(),
    isFlagged: false,
    wasDecrypted: false,
    encryptedEmployeeId: data.isAnonymous ? "enc_new" : undefined,
  };

  MOCK_FEEDBACKS.unshift(newFeedback as any);

  return {
    isError: false,
    status: 201,
    data: {
      result: newFeedback,
    },
    message: "Feedback created successfully",
  };
};

export const updateFeedback = async (
  id: string,
  data: UpdateFeedbackBody
): Promise<ApiResponse<any>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const index = MOCK_FEEDBACKS.findIndex((f) => f._id === id);
  if (index !== -1) {
    MOCK_FEEDBACKS[index] = {
      ...MOCK_FEEDBACKS[index],
      ...data,
      encryptedEmployeeId: data.isAnonymous ? "enc_updated" : undefined,
    };
    return {
      isError: false,
      status: 200,
      data: {
        result: MOCK_FEEDBACKS[index],
      },
      message: "Feedback updated successfully",
    };
  }

  return {
    isError: true,
    status: 404,
    data: null,
    message: "Feedback not found",
  };
};

export const deleteFeedback = async (id: string): Promise<ApiResponse<any>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const index = MOCK_FEEDBACKS.findIndex((f) => f._id === id);
  if (index !== -1) {
    MOCK_FEEDBACKS.splice(index, 1);
    return {
      isError: false,
      status: 200,
      data: null,
      message: "Feedback deleted successfully",
    };
  }

  return {
    isError: true,
    status: 404,
    data: null,
    message: "Feedback not found",
  };
};

