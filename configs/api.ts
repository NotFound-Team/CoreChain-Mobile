export const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const API_ENDPOINT = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    LOGOUT: `/auth/logout`,
    REFRESH: `/auth/refresh`,
    ACCOUNT: "/auth/account",
  },

  USER: {
    INDEX: "/users",
    DETAIL: (id: string) => `/users/${id}`,
    PRIVATE: (id: string) => `/users/private/${id}`,
    PUBLIC: (id: string) => `/users/public/${id}`,
    CHANGE_PASSWORD: "/users/password/change",
  },

  DEPARTMENT: {
    INDEX: "/departments",
    DETAIL: (id: string) => `/departments/${id}`,
  },

  POSITION: {
    INDEX: "/positions",
    DETAIL: (id: string) => `/positions/${id}`,
  },

  ROLE: {
    INDEX: "/roles",
    DETAIL: (id: string) => `/roles/${id}`,
  },

  PERMISSION: {
    INDEX: "/permissions",
    DETAIL: (id: string) => `/permissions/${id}`,
  },

  FEEDBACK: {
    INDEX: "/feedback",
    DETAIL: (id: string) => `/feedback/${id}`,
    DECRYPT: (id: string) => `/feedback/decrypt/${id}`,
  },

  CONTRACT: {
    INDEX: "/contracts",
    DETAIL: (id: string) => `/contracts/${id}`,
  },

  TASK: {
    INDEX: "/tasks",
    DETAIL: (id: string) => `/tasks/${id}`,
  },

  PROJECT: {
    INDEX: "/projects",
    DETAIL: (id: string) => `/projects/${id}`,
  },

  PERSONNEL: {
    ADJUSTMENT: (id: string) => `/personnel/adjustments/${id}`,
    SALARY_CAL: (id: string) => `/personnel/salary/${id}`,
    WORKING_HOURS: (id: string) => `/personnel/working-hours/${id}`,
    KPI_CAL: (id: string) => `/personnel/kpi/${id}`,

    SALARY_ADVANCE: "/personnel/salary",
    APPROVE_ADVANCE: "/personnel/salary/approve",
    CALCULATE_ADVANCE: "/personnel/salary/calculate",
  },

  REPORT: {
    EMPLOYEES: "/reports/employees",
    TURNOVER: "/reports/turnover",
    WORKING_HOURS: "/reports/working-hours",
    DAY_OFF: "/reports/day-off",
    KPI: "/reports/kpi",
    SALARY: "/reports/salary",
  },

  FILE: {
    UPLOAD: "/files/upload",
  },

  CHAT: {
    INDEX: `${process.env.NEXT_PUBLIC_BASE_URL_SOCKET}/chat`,
  },
};
