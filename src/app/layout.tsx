import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "@/providers/NextAuthSessionProvider";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "react-hot-toast";
import CustomerSupportLogo from "@/components/shared/CustomerSupportLogo";

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
    process.env.NEXT_PUBLIC_SITE_URL || "https://mitra-cake-shop.vercel.app",
  ),

  title: "Mitra Cake Shop - Fresh & Custom Cakes in Bangladesh",

  description:
    "Mitra Cake Shop is a trusted online cake shop in Bangladesh. Order fresh, delicious, and customized cakes for birthdays, weddings, and special occasions with fast delivery.",

  keywords: [
    "Cake Shop Bangladesh",
    "Online Cake Shop BD",
    "Buy Cakes Online Bangladesh",
    "Birthday Cake Bangladesh",
    "Wedding Cake Bangladesh",
    "Custom Cake Bangladesh",
    "Chocolate Cake BD",
    "Fresh Cake Delivery Bangladesh",
    "Best Cake Shop BD",
    "Mitra Cake Shop",
  ],

  authors: [{ name: "Mitra Cake Shop", url: "" }],

  robots: "index, follow",

  verification: {
    google: "",
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },

  openGraph: {
    title: "Mitra Cake Shop - Fresh & Custom Cakes",
    description:
      "Order delicious cakes online from Mitra Cake Shop. Perfect for birthdays, weddings, and celebrations with fast delivery across Bangladesh.",
    url: "https://mitra-cake-shop.vercel.app",
    siteName: "Mitra Cake Shop",
    images: [
      {
        url: "https://mitra-cake-shop.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mitra Cake Shop",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Mitra Cake Shop - Online Cake Store",
    description:
      "Fresh and customized cakes for birthdays, weddings, and celebrations. Order online from Mitra Cake Shop.",
    images: ["https://mitra-cake-shop.vercel.app/og-image.jpg"],
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
        <link rel="manifest" href="/site.webmanifest" />
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
                  primary: "#ec4899",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />

          <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm">
            <Navbar />
          </header>

          <main className="flex-1 w-full">
            <div className="mx-auto max-w-7xl">{children}</div>
            <CustomerSupportLogo />
          </main>

          <footer className="border-t border-gray-100 bg-white">
            <Footer />
          </footer>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}