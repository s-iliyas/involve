"use client";

import { useContext } from "react";
import { Alegreya } from "next/font/google";
import { ThemeContext } from "@/contexts/ThemeProvider";

const inter = Alegreya({ subsets: ["greek"] });

const MainComponent = ({ children }: { children: React.ReactNode }) => {
  const theme = useContext(ThemeContext);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme?.darkMode ? "#000000" : "#FFFFFF",
        color: theme?.darkMode ? "#FFFFFF" : "#000000",
      }}
    >
      {children}
    </div>
  );
};

export default MainComponent;
