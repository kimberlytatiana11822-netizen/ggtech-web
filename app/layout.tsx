import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./Footer";
import { SITE } from "./config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    template: "%s | Artigas Shop",
    default: "Artigas Shop — Tu tienda de confianza",
  },
  description: SITE.description,
  keywords: [
    "artigas",
    "tienda",
    "tecnología",
    "computadoras",
    "gaming",
    "cocina",
    "uruguay",
  ],
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: "Artigas Shop — Tu tienda de confianza",
    description: SITE.description,
    locale: "es_UY",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artigas Shop — Tu tienda de confianza",
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Artigas",
      addressCountry: "UY",
    },
  }

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
