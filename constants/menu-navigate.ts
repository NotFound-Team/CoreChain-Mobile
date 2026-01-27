import { Ionicons } from "@expo/vector-icons";
import { Href } from "expo-router";

interface MenuItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  href: Href;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "dept",
    label: "Departments",
    icon: "business-outline",
    color: "#4F46E5",
    href: "/department" as any,
  },
  {
    id: "project",
    label: "Projects",
    icon: "briefcase-outline",
    color: "#3B82F6",
    href: "/project" as any,
  },
  {
    id: "task",
    label: "Tasks",
    icon: "list-outline",
    color: "#8862F2",
    href: "/challange" as any,
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: "calendar-outline",
    color: "#EC4899",
    href: "/calendar" as any,
  },
  {
    id: "meeting",
    label: "Meetings",
    icon: "videocam-outline",
    color: "#10B981",
    href: "/meeting" as any,
  },
  {
    id: "messages",
    label: "Messages",
    icon: "chatbubble-ellipses-outline",
    color: "#F59E0B",
    href: "/messages" as any,
  },
  {
    id: "expense",
    label: "Expenses",
    icon: "card-outline",
    color: "#6366F1",
    href: "/expense" as any,
  },
  {
    id: "personnel",
    label: "Personnel",
    icon: "people-outline",
    color: "#8B5CF6",
    href: "/personnel" as any,
  },
  {
    id: "feedback",
    label: "Feedback",
    icon: "help-circle-outline",
    color: "#06B6D4",
    href: "/feedback" as any,
  },
  {
    id: "profile",
    label: "Profile",
    icon: "person-outline",
    color: "#64748B",
    href: "/profile" as any,
  },
  {
    id: "notif",
    label: "Notifications",
    icon: "notifications-outline",
    color: "#F97316",
    href: "/notifications" as any,
  },
  {
    id: "personal",
    label: "Personal",
    icon: "finger-print-outline",
    color: "#EC4899",
    href: "/personal" as any,
  },
];
