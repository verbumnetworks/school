"use client";

import { useSession } from "next-auth/react";
import { SignOutButton } from "./SIgnOutButton";
import { FaSearch } from 'react-icons/fa'
import { LuMessageCircleMore } from "react-icons/lu";
import { GrAnnounce } from "react-icons/gr";
const Navbar = () => {
  const { data: session } = useSession()
  const fullName = session?.user?.name || "Guest";
  const role = session?.user?.role || "unknown";
  return (
    <div className="flex items-center justify-between p-4 border-b-[0.2px] ">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <FaSearch className="w-4 h-4" />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>

      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <LuMessageCircleMore className="w-6 h-6" />
        </div>

        <div className="rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <GrAnnounce className="w-6 h-6" />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{fullName}</span>
          <span className="text-[10px] text-gray-500 text-right">{role}</span>
        </div>

        <SignOutButton />
      </div>
    </div>
  );
};

export default Navbar;
