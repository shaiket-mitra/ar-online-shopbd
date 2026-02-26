import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "@/providers/NextAuthSessionProvider";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "Mitra Cake Shop | Premium Cakes & Desserts",
  description:
    "Discover our exquisite collection of artisanal cakes and desserts crafted with love and premium ingredients",
  keywords: ["cakes", "desserts", "bakery", "pastries", "wedding cakes"],
  openGraph: {
    title: "Mitra Cake Shop",
    description: "Premium Cakes & Desserts",
    url: "/",
    siteName: "Mitra Cake Shop",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mitra Cake Shop",
    description: "Premium Cakes & Desserts",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          type="image/png"
          sizes="180x180"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-white text-gray-900 min-h-screen flex flex-col`}
      >
        <NextAuthSessionProvider>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              className: "font-sans",
              style: {
                borderRadius: "0.5rem",
                background: "#fff",
                color: "#111827",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                border: "1px solid #f3f4f6",
              },
              success: {
                iconTheme: {
                  primary: "#ec4899", // pink-500
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444", // red-500
                  secondary: "#fff",
                },
              },
            }}
          />
          
          <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm">
            <Navbar />
          </header>

          <main className="flex-1 w-full">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>

          <footer className="border-t border-gray-100 bg-white">
            <Footer />
          </footer>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}