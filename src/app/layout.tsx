import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next";

// ✅ Import Inter font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// ✅ Import Playfair Display font as a variable
const playfair = Playfair_Display({
  weight: ["600"],
  subsets: ["latin"],
  variable: "--font-playfair", // define as CSS variable
});

export const metadata: Metadata = {
  title: "Voxa AI",
  description: "The Voice in the Call That Never Forgets.",
 icons: {
    icon: [
      { url: "/logoVox.png", type: "image/png", sizes: "32x32" },
      { url: "/logoVox.png", type: "image/png", sizes: "64x64" },
      { url: "/logoVox.png", type: "image/png", sizes: "128x128" }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NuqsAdapter>
      <TRPCReactProvider>
        <html lang="en">
          <body
            className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
          >
            <Toaster />
            {children}
          </body>
        </html>
      </TRPCReactProvider>
    </NuqsAdapter>
  );
}
