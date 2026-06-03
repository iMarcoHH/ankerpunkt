import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ankerpunkt — Dein Finanz-Überblick",
  description: "Klar. Kurs halten. Dein persönlicher Finanz-Manager.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
