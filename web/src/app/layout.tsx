import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Advent of Code Solutions",
  description: "My solutions for Advent of Code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
