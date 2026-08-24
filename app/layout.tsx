import type { Metadata } from "next";
import { Archivo_Black, Geist, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import { auth } from "@/auth";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LiveStatsBar } from "@/components/LiveStatsBar";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const display = Archivo_Black({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const ibm = IBM_Plex_Mono({
  variable: "--font-ibm",
  weight: ["400", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShipOrSkip.lol",
  description: "Satirical MRR ladder. Swipe indie apps. Outbid your rivals. Call BS on fake revenue.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  twitter: { card: "summary_large_image" },
  openGraph: { type: "website", siteName: "ShipOrSkip.lol" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${display.variable} ${ibm.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Script id="theme-boot" strategy="beforeInteractive">
          {`try{var t=localStorage.getItem("theme");if(t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`}
        </Script>
        <Providers session={session}>
          <Header />
          <LiveStatsBar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
