"use client";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import '@/styles/globals.css'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans`}>
        <div>
          <SessionProvider>
            <NextThemesProvider defaultTheme="light" attribute="class">
              <NextUIProvider>{children}</NextUIProvider>
            </NextThemesProvider>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
