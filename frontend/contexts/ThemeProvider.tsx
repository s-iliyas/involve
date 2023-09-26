"use client";
import React, { createContext, useState } from "react";

type AppProps = {
  children: React.ReactNode;
};

export type ThemeContextProp = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ThemeContext = createContext<ThemeContextProp | null>(null);

export const ThemeProvider = ({ children }: AppProps) => {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
