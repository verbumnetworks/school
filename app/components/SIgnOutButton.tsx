"use client";
import { signOut } from "next-auth/react";
export const SignOutButton = () => (
  <button
    onClick={() => signOut({redirect: true, callbackUrl: '/'})}
    className="p-1.5 text-sm rounded-md hover:bg-foreground hover:text-background transition-colors duration-300 border border-red-500 shadow-sm shadow-red-500/50"
  >
    Sign Out
  </button>
);
