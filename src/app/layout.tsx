import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taylor Made Tech Net",
  description: "Saas Company for all businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
