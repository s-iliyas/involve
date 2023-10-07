"use client";
import React, { useEffect, useState } from "react";
import ThemeButton from "../ui/ThemeButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/hooks/store";
import { RootState } from "@/store";
import useLogout from "@/hooks/useLogout";
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();
  const accessToken = useAppSelector(
    (state: RootState) => state.user.accessToken
  );
  const user = useAppSelector((state: RootState) => state.user.userDetails);
  const navItems = [
    { title: "Home", path: "/", active: pathname === "/" },
    { title: "Rooms", path: "/rooms", active: pathname === "/rooms" },
    { title: "Chat", path: "/chat", active: pathname === "/chat" },
    { title: "Profile", path: "/profile", active: pathname === "/profile" },
  ];

  const { msg, logout } = useLogout(accessToken);

  useEffect(() => {
    if (msg) {
      window.location.href = "/";
    }
  }, [msg]);

  return (
    <div className="p-2 h-14 w-full flex flex-row justify-around items-center  fixed  bg-inherit">
      <strong className="text-4xl font-extrabold">involve</strong>
      <div className="flex flex-row space-x-10 items-center">
        <ThemeButton />
        <div className="md:flex flex-row hidden items-end justify-center space-x-3">
          {navItems.map((item) => (
            <Link
              key={item.title}
              href={item.path}
              className={`${
                item.active && "text-sky-300"
              } hover:text-sky-300 text-lg`}
            >
              {item.title}
            </Link>
          ))}
          {!accessToken ? (
            <Link
              href={"/login"}
              className="hover:text-sky-300 hidden md:block px-3 rounded-md font-semibold text-lg"
            >
              Login
            </Link>
          ) : (
            // <button
            //   className="hover:text-orange-300 md:block hidden text-lg"
            //   onClick={() => {
            //     logout();
            //   }}
            // >
            //   Logout
            // </button>
            <Image
              alt=""
              src="/icons/user.png"
              height={30}
              width={30}
              className="border-2 rounded-full hover:cursor-pointer border-sky-300"
              onClick={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
