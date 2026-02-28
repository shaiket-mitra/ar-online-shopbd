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
    process.env.NEXT_PUBLIC_SITE_URL || "https://ar-online-shopbd.vercel.app",
  ),

  title: "AR Online ShopBD - Premium Watch Store in Bangladesh",

  description:
    "AR Online ShopBD is a trusted online watch store in Bangladesh. Explore premium men's and women's watches at the best prices with fast delivery nationwide.",

  keywords: [
    "Watch Store Bangladesh",
    "Buy Watches Online BD",
    "Online Watch Shop BD",
    "Men's Watch Bangladesh",
    "Women's Watch Bangladesh",
    "Premium Watches BD",
    "Luxury Watches Bangladesh",
    "Affordable Watches BD",
    "Genuine Watches Bangladesh",
    "AR Online ShopBD",
    "Best Watch Store in Bangladesh",
  ],

  authors: [{ name: "AR Online ShopBD", url: "https://ar-online-shopbd.vercel.app" }],

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
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
      // { url: "/apple-touch-icon-152x152.png", sizes: "152x152" },
      // { url: "/apple-touch-icon-167x167.png", sizes: "167x167" },
    ],
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
      // {
      //   rel: "mask-icon",
      //   url: "/safari-pinned-tab.svg",
      //   color: "#5bbad5",
      // },
    ],
  },

  openGraph: {
    title: "AR Online ShopBD - Premium Watch Collection",
    description:
      "Shop premium men's and women's watches online in Bangladesh. 100% authentic products with fast delivery nationwide.",
    url: "https://ar-online-shopbd.vercel.app",
    siteName: "AR Online ShopBD",
    images: [
      {
        url: "https://ar-online-shopbd.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AR Online Watch Store",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "AR Online ShopBD - Watch Store in Bangladesh",
    description:
      "Premium watches for men & women in Bangladesh. Best price, authentic products, fast delivery.",
    images: ["https://ar-online-shopbd.vercel.app/og-image.jpg"],
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