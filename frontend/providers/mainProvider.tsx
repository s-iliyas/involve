"use client";
import React from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "./themeProvider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { store } from "@/store";

const MainProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Navbar />
        {children}
        <Footer />
      </ThemeProvider>
    </Provider>
  );
};

export default MainProvider;
