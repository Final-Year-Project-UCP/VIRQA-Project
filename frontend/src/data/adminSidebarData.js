import { Bell, User, History, PlusCircle, MessageSquare, Star, LayoutDashboard } from "lucide-react";

export const notifications = [
    "New system alert",
    "User report received",
    "System maintenance scheduled",
];

export const sidebarItems = [
    { name: "Dashboard", path: "/api/v1/admin/dashboard", icon: LayoutDashboard },
    { name: "Profile", path: "/api/v1/admin/profile", icon: User },
    { name: "Manage Users", path: "/api/v1/admin/users", icon: User },
    { name: "History", path: "/api/v1/admin/history", icon: History },
    { name: "Notifications", path: "/api/v1/admin/notifications", icon: Bell },
    { name: "Settings", path: "/api/v1/admin/settings", icon: Star },
];
