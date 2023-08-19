"use client";
import React from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "./themeProvider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { persistor, store } from "@/store";
import { PersistGate } from "redux-persist/integration/react";

const MainProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default MainProvider;
