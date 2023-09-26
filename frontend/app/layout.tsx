import { ThemeProvider } from "@/contexts/ThemeProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Alegreya } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import MainComponent from "./main";

const inter = Alegreya({ subsets: ["greek"] });

export const metadata: Metadata = {
  title: "involve",
  description: "Get together with loved one's.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <MainComponent>
            <Navbar />
            {children}
            <Footer />
          </MainComponent>
        </ThemeProvider>
      </body>
    </html>
  );
}
