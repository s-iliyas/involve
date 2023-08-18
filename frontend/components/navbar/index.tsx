"use client";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "../toggleTheme";
import { LogInIcon, UserCircle } from "lucide-react";
import { Button } from "../ui/button";
import MainNav from "./mainNav";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

const Navbar = () => {
  const [mount, setMount] = useState<string|undefined>("");
  const { theme } = useTheme();

  useEffect(() => {
    setMount(theme);
  }, [theme]);
  
  if (!mount) return null;


  const token =
    typeof localStorage !== "undefined" && localStorage.getItem("involveToken");

  return (
    <div
      className={cn(
        "fixed flex w-full h-14 justify-between items-center md:px-16 px-2 ",
        mount === "dark" ? "bg-neutral-950" : "bg-white"
      )}
      style={{ zIndex: 9999 }}
    >
      <div>
        <strong className="text-2xl">Involve</strong>
      </div>
      <MainNav />
      <div className="flex flex-row justify-evenly gap-x-2 items-center">
        <ModeToggle />
        {token ? (
          <Button
            variant={"ghost"}
            size="icon"
            className="hover:bg-transparent"
          >
            <Image
              height={20}
              width={20}
              src="/images/user.png"
              alt="user icon"
            />
          </Button>
        ) : (
          <Button asChild className="cursor-pointer">
            <Link href={"/login"} className="gap-x-1 flex items-center">
              <LogInIcon className="h-4 w-4" />
              <strong>Login</strong>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
