import type { Metadata } from "next";
import "@/styles/globals.css"
import Header from "@/components/ui/Header";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Footer from "@/components/ui/Footer"

export const metadata: Metadata = {
  title: "Luca Pignataro - Software developer",
  description: "Luca Pignataro's web development portfolio",
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
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
