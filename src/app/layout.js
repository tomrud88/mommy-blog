import Navbar from "@/navbar/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "@/footer/Footer";
import TopSection from "@/topSection/TopSection";
import AuthProvider from "@/providers/AuthProvider";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blog Mama - Macierzyństwo pełne pomysłów i wsparcia",
  description:
    "Praktyczne porady dla mam, inspiracje dla dzieci, recenzje książek rodzicielskich. Dziel się doświadczeniami macierzyństwa w naszej wspierającej społeczności.",
  keywords:
    "macierzyństwo, mama, dziecko, rodzicielstwo, porady, zabawy, książki, blog rodzicielski",
  authors: [{ name: "Blog Mama" }],
  openGraph: {
    title: "Blog Mama - Macierzyństwo pełne pomysłów",
    description:
      "Praktyczne porady dla mam, inspiracje dla dzieci, recenzje książek rodzicielskich.",
    type: "website",
    locale: "pl_PL",
    url: "https://mommy-blog.vercel.app",
    siteName: "Blog Mama",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Mama - Macierzyństwo pełne pomysłów",
    description:
      "Praktyczne porady dla mam, inspiracje dla dzieci, recenzje książek rodzicielskich.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-token", // Dodaj rzeczywisty token
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3b82f6",
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Blog Mama",
    description: "Macierzyństwo pełne pomysłów i wsparcia",
    url: "https://mommy-blog.vercel.app",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://mommy-blog.vercel.app/?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="pl">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3b82f6" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <div className="container">
              <Navbar />
              <div className="wrapper">{children}</div>
              <Footer />
            </div>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
