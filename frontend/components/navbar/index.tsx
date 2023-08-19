"use client";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "../toggleTheme";
import { LogInIcon } from "lucide-react";
import { Button } from "../ui/button";
import MainNav from "./mainNav";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useAppSelector } from "@/hooks/store";
import ProfileBtn from "./profileBtn";

const Navbar = () => {
  const [mount, setMount] = useState<string | undefined>("");

  const { theme } = useTheme();

  let token = useAppSelector((state) => state.user.involveToken);

  useEffect(() => {
    setMount(theme);
  }, [theme, token]);

  if (!mount) return null;

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
          <ProfileBtn />
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
