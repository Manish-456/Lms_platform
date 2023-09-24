"use client";
import { Layout, Compass, List, BarChart } from "lucide-react";
import React from "react";
import SidebarItem from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

const teacherRoutes = [  {
  icon: List,
  label: "Courses",
  href: "/teacher/courses",
},
{
  icon: BarChart,
  label: "Analytics",
  href: "/teacher/analytics",
}
]

export default function SidebarRoutes() {
  const pathname = usePathname();
  const isTeacherPage = pathname.includes('/teacher');
  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex w-full flex-col">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          href={route.href}
          label={route.label}
        />
      ))}
    </div>
  );
}
