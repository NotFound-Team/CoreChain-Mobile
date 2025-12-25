export const MOCK_PROJECTS = [
  {
    _id: "6831fdab16db5a9ef3648e93",
    name: "project 1",
    description: "Phát triển hệ thống quản lý nhân sự nội bộ cho doanh nghiệp.",
    attachments: [],
    department: "67e588baeba058bfa9416538",
    manager: {
      _id: "67e342fdb0a106147b7bcd66",
      name: "Cao Nguyen Tri Ngoc 1",
      email: "caonguyentringoc1@gmail.com",
    },
    teamMembers: [
      {
        _id: "67e647a11ed84e5d14d0094f",
        name: "cao tri ngoc",
        email: "caotringoc11@gmail.com",
      },
    ],
    tasks: [
      { _id: "67e3136d36b247c83d6323a8", name: "Thiết kế Database" },
      { _id: "67e3136d36b247c83d6323a9", name: "Viết API Auth" },
    ],
    expenses: [],
    revenue: 5000,
    priority: 3, // High
    status: 2, // In Progress
    startDate: "2025-03-25T20:42:10.885Z",
    endDate: "2025-06-25T20:42:10.885Z",
    actualEndDate: null,
    isDeleted: false,
    deletedAt: null,
    createdAt: "2025-05-24T17:11:07.026Z",
    updatedAt: "2025-05-24T17:11:07.026Z",
    __v: 0,
    progress: 45,
  },
  {
    _id: "6831fdab16db5a9ef3648e94",
    name: "E-Commerce Mobile App",
    description:
      "Xây dựng ứng dụng mua sắm trực tuyến trên nền tảng React Native.",
    attachments: ["design_final.pdf"],
    department: "67e588baeba058bfa9416538",
    manager: {
      _id: "67e342fdb0a106147b7bcd66",
      name: "Cao Nguyen Tri Ngoc 1",
      email: "caonguyentringoc1@gmail.com",
    },
    teamMembers: [
      {
        _id: "67e647a11ed84e5d14d00950",
        name: "Nguyen Van A",
        email: "vana@gmail.com",
      },
      {
        _id: "67e647a11ed84e5d14d00951",
        name: "Le Thi B",
        email: "thib@gmail.com",
      },
    ],
    tasks: [
      { _id: "67e3136d36b247c83d6323b0", name: "Tích hợp cổng thanh toán" },
    ],
    expenses: [],
    revenue: 12000,
    priority: 2, // Medium
    status: 1, // To Do
    startDate: "2025-07-01T08:00:00.000Z",
    endDate: "2025-12-31T17:00:00.000Z",
    actualEndDate: null,
    isDeleted: false,
    deletedAt: null,
    createdAt: "2025-06-01T09:00:00.000Z",
    updatedAt: "2025-06-01T09:00:00.000Z",
    __v: 0,
    progress: 0,
  },
  {
    _id: "6831fdab16db5a9ef3648e95",
    name: "AI Chatbot Integration",
    description: "Tích hợp Chatbot AI hỗ trợ khách hàng tự động vào website.",
    attachments: [],
    department: "67e588baeba058bfa9416539",
    manager: {
      _id: "67e342fdb0a106147b7bcd67",
      name: "Manager Sarah",
      email: "sarah.manager@company.com",
    },
    teamMembers: [
      {
        _id: "67e647a11ed84e5d14d0094f",
        name: "cao tri ngoc",
        email: "caotringoc11@gmail.com",
      },
    ],
    tasks: [
      { _id: "67e3136d36b247c83d6323c1", name: "Training Model" },
      { _id: "67e3136d36b247c83d6323c2", name: "Deploy Production" },
    ],
    expenses: [],
    revenue: 8500,
    priority: 1, // Low
    status: 4, // Finished/Done
    startDate: "2025-01-10T08:00:00.000Z",
    endDate: "2025-03-20T17:00:00.000Z",
    actualEndDate: "2025-03-18T15:30:00.000Z",
    isDeleted: false,
    deletedAt: null,
    createdAt: "2025-01-05T10:00:00.000Z",
    updatedAt: "2025-03-18T15:30:00.000Z",
    __v: 0,
    progress: 100,
  },
];
