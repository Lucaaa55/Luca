import type { Metadata } from "next";
import "@/styles/globals.css"

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
        className={``}
      >
        {children}
      </body>
    </html>
  );
}
