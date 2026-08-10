import type { Metadata } from "next";
import localFont from "next/font/local";
import QueryProvider from "@/providers/QueryProvider";
import "./globals.css";

const ibmPlexSansArabic = localFont({
  src: [
    { path: "../assets/fonts/IBMPlexSansArabic-Thin.woff2", weight: "100" },
    {
      path: "../assets/fonts/IBMPlexSansArabic-ExtraLight.woff2",
      weight: "200",
    },
    { path: "../assets/fonts/IBMPlexSansArabic-Light.woff2", weight: "300" },
    { path: "../assets/fonts/IBMPlexSansArabic-Regular.woff2", weight: "400" },
    { path: "../assets/fonts/IBMPlexSansArabic-Medium.woff2", weight: "500" },
    {
      path: "../assets/fonts/IBMPlexSansArabic-SemiBold.woff2",
      weight: "600",
    },
    { path: "../assets/fonts/IBMPlexSansArabic-Bold.woff2", weight: "700" },
  ],
  variable: "--font-ibm-plex-sans-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Madarik App",
  description: "Modular Next.js Application Architecture",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${ibmPlexSansArabic.variable} ${ibmPlexSansArabic.className} h-full antialiased`}
    >
      <body className={`${ibmPlexSansArabic.className} min-h-full flex flex-col font-sans`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
