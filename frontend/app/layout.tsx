import "./globals.css";
import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { ThemeProvider } from "@/providers/themeProvider";
import { Provider } from "react-redux";
import { store } from "@/store";
import MainProvider from "@/providers/mainProvider";

const inter = Josefin_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Involve",
  description: "Get into communication with others",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MainProvider>{children}</MainProvider>
      </body>
    </html>
  );
}
