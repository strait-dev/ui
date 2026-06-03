import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Strait UI — React design system",
    template: "%s — Strait UI",
  },
  description:
    "A React design system of 120+ accessible, themeable components built on Base UI and Tailwind CSS v4.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className="font-sans" lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider theme={{ defaultTheme: "light", enableSystem: false }}>
          {children}
        </RootProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
