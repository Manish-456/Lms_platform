"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import SearchInput from "./search-input";
import { isTeacher } from "@/lib/teacher";

export default function NavbarRoutes() {
  const pathname = usePathname();
  const {userId} = useAuth();
  

  const isTeacherPage = pathname.startsWith("/teacher");
  const isPlayerPage = pathname.includes("/courses");
  const isSearchPage = pathname.includes("/search");

  return (
    <>
    {isSearchPage && (
      <div className="hidden md:block">
        <SearchInput />

      </div>
    )}
    <div className="flex gap-x-2 ml-auto">
      {isTeacherPage || isPlayerPage ? (
        <Link href={"/"}>
          {" "}
          <Button variant={"ghost"} size={"sm"}>
            <LogOut className="h-4 w-4 mr-2" /> Exit
          </Button>
        </Link>
      ) :  isTeacher(userId) ? (
        <Link href={"/teacher/courses"}>
          <Button variant={"ghost"} size={"sm"}>
            Teacher mode
          </Button>
        </Link>
      ) : null}
      <UserButton afterSignOutUrl="/" />
    </div>
          </>
  );
}
