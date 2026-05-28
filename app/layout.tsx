import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/lib/app-context";
import { ProgressProvider } from "@/lib/progress-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aethel Solutions",
  description:
    "Learn with clear lessons, guided practice, and simple step-by-step support from Aethel Solutions Learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <AppProvider>
          <ProgressProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ProgressProvider>
        </AppProvider>
      </body>
    </html>
  );
}
