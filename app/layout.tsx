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
  title: "Thumbnail Learning",
  description:
    "Learn new skills with easy-to-follow video courses, interactive labs, and hands-on projects. Thumbnail Learning makes it simple.",
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
