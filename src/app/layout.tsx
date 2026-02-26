import type { Metadata } from "next";
import "@/styles/globals.css"
import Header from "@/components/ui/Header";

export const metadata: Metadata = {
  title: "Lucas's Portfolio",
  description: "Lucas's web development portfolio",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
