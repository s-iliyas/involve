"use client";

import { ThemeContext } from "@/contexts/ThemeProvider";
import React, { useContext } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

const ThemeButton = () => {
  const theme = useContext(ThemeContext);

  return (
    <button
      className="text-gray-500 hover:text-sky-300"
      onClick={() => theme?.setDarkMode(!theme?.darkMode)}
    >
      {theme?.darkMode ? <FiSun /> : <FiMoon />}
    </button>
  );
};

export default ThemeButton;
