"use client";
import React from "react";
import ThemeButton from "../ui/ThemeButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [{ title: "Home", path: "/", active: pathname === "/" }];

  const token =
    typeof localStorage !== "undefined" && localStorage.getItem("involveTk");

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
          {!token ? (
            <Link
              href={"/login"}
              className="hover:text-sky-300 hidden md:block px-3 rounded-md font-semibold text-lg"
            >
              Login
            </Link>
          ) : (
            <button
              className="hover:text-orange-300 md:block hidden text-lg"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
