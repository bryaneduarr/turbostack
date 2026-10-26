import { Toaster } from "@workspace/ui/components/toast/toaster.component";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/app/globals.css";
import { APP_NAME } from "@/config/branding/app-name.config";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Full-stack starter web client.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
