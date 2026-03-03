import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Retention Health",
  description: "GLP-1 Patient Retention Platform",
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
