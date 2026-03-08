import React from "react";
import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "./header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hector Alvarez",
  description: "IT Support & Python Developer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-black antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
