  import { Bell,User, History, PlusCircle, MessageSquare, Star,LayoutDashboard } from "lucide-react";

  export const notifications = [
    "New candidate applied for Interview",
    "Feedback received from employee",
    "System maintenance scheduled at 5 PM",
    "Rating updated for candidate X",
  ];

 export const sidebarItems = [
    { name: "Dashboard", path: "/api/v1/employee/dashboard", icon: LayoutDashboard },
  { name: "Profile", path: "/api/v1/employee/profile", icon: User },
  { name: "Create Interview", path: "/api/v1/employee/create-interview", icon: PlusCircle },
  { name: "History", path: "/api/v1/employee/history", icon: History },
  { name: "Notifications", path: "/api/v1/employee/notifications", icon: Bell },
  { name: "Feedback", path: "/api/v1/employee/feedback", icon: MessageSquare },

];
