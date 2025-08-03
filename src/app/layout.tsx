import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Never Bored Lovers",
  description: "Fun games for couples in long-distance relationships.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
