"use client"; // Mark as a client component

import { usePathname } from "next/navigation";
import {
  FaHome, FaUser, FaChalkboardTeacher, FaUsers, FaBook, FaCalendarAlt, FaClipboardList,
  FaChartLine, FaUserCog, FaSignOutAlt
} from 'react-icons/fa';
import { SiGoogleclassroom } from "react-icons/si";
import { MdSubject } from "react-icons/md";
import { PiExam } from "react-icons/pi";
import { GrAnnounce } from "react-icons/gr";
import { RiParentFill } from "react-icons/ri";
import Link from "next/link";
import { useSession } from "next-auth/react";


const Menu = () => {
  const pathname = usePathname();
  const { data: session } = useSession()
  const role = session?.user?.role || "unknown";
  const menuItems = [
    {
      title: "MENU",
      items: [
        {
          icon: FaHome,
          label: "Home",
          href: `/${role}`,
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: FaChalkboardTeacher,
          label: "Teachers",
          href: "/list/teachers",
          visible: ["admin", "teacher"],
        },
        {
          icon: FaUsers,
          label: "Students",
          href: "/list/students",
          visible: ["admin", "teacher"],
        },
        {
          icon: RiParentFill,
          label: "Parents",
          href: "/list/parents",
          visible: ["admin", "teacher"],
        },
        {
          icon: MdSubject,
          label: "Subjects",
          href: "/list/subjects",
          visible: ["admin"],
        },
        {
          icon: SiGoogleclassroom,
          label: "Classes",
          href: "/list/classes",
          visible: ["admin", "teacher"],
        },
        {
          icon: FaBook,
          label: "Lessons",
          href: "/list/lessons",
          visible: ["admin", "teacher"],
        },
        {
          icon: PiExam,
          label: "Exams",
          href: "/list/exams",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: FaClipboardList,
          label: "Assignments",
          href: "/list/assignments",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: FaChartLine,
          label: "Results",
          href: "/list/results",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: FaCalendarAlt,
          label: "Events",
          href: "/list/events",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: GrAnnounce,
          label: "Announcements",
          href: "/list/announcements",
          visible: ["admin", "teacher", "student", "parent"],
        },
      ],
    },
    {
      title: "OTHER",
      items: [
        {
          icon: FaUser,
          label: "Profile",
          href: "/profile",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: FaUserCog,
          label: "Settings",
          href: "/settings",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: FaSignOutAlt,
          label: "Logout",
          href: "/logout",
          visible: ["admin", "teacher", "student", "parent"],
        },
      ],
    },
  ];
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-1" key={section.title}>
          <span className="hidden lg:block font-light my-2">
            {section.title}
          </span>
          {section.items.map((item) => {
            if (item.visible.includes(role)) {
              const isActive = pathname === item.href;
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 py-2 md:px-2 rounded-md"
                >
                  <item.icon className="w-6 h-4" />
                  <span className={`hidden text-sm lg:block ${isActive ? "text-red-500" : ""}`}>
                    {item.label}
                  </span>
                </Link>
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;