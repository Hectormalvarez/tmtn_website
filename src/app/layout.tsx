import React from "react";
import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "./header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaylorMadeTechNet",
  description: "your technology solution for business",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
