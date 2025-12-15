import { Bell, User, ClipboardList, Users, Settings, LayoutDashboard, ShieldCheck } from "lucide-react";

export const notifications = [
    "New system alert",
    "User report received",
    "System maintenance scheduled",
];

export const sidebarItems = [
    { name: "Dashboard", path: "/api/v1/admin", icon: LayoutDashboard },
    { name: "Manage Employees", path: "/api/v1/admin/manage/employee", icon: Users },
    { name: "View Interviews", path: "/api/v1/admin/view/interview", icon: ClipboardList },
    { name: "My Profile", path: "/api/v1/admin/profile", icon: ShieldCheck },
    { name: "Notifications", path: "/api/v1/admin/notifications", icon: Bell },
    { name: "Settings", path: "/api/v1/admin/comingsoon/settings", icon: Settings },
];
