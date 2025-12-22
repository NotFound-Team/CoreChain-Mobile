export const ROUTE_LIST = {
  AUTH: {
    SIGNIN: "(auth)/signin",
  },
  TABS: {
    INDEX: "(tabs)/index",
    CALENDAR: "(tabs)/calendar",
    CHALLANGE: "(tabs)/challange",
    EXPENSE: "(tabs)/expense",
    LEAVE: "(tabs)/leave",
  },
  MODAL: "modal",
} as const;

export type RouteListType = typeof ROUTE_LIST;