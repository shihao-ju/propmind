import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import DemoWrapper from "@/components/DemoWrapper";
import Navbar from "@/components/Navbar";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PropMind — AI Property Manager",
  description: "Fire your property manager. Keep the service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-sans antialiased bg-gray-50`}>
        <div className="flex flex-col h-screen">
          <Navbar />
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
        <DemoWrapper />
      </body>
    </html>
  );
}
