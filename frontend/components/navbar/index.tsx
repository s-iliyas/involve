import React from "react";
import ThemeButton from "../ui/ThemeButton";

const Navbar = () => {
  return (
    <div className="h-14 p-2 flex flex-row justify-around items-center">
      <strong className="text-4xl font-extrabold">involve</strong>
      <div className="flex flex-row space-x-2 items-center">
        <ThemeButton />
      </div>
    </div>
  );
};

export default Navbar;
