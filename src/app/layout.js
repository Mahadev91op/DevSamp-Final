import { Inter, Outfit } from "next/font/google";
import "./globals.css";

// Components Imports
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import Noise from "@/components/Noise";
import ScrollToTop from "@/components/ScrollToTop";

// New Features Imports
import Preloader from "@/components/Preloader";
import ProgressBar from "@/components/ProgressBar";
import WhatsAppBtn from "@/components/WhatsAppBtn";
import Chatbot from "@/components/Chatbot";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

// --- IMPROVED SEO METADATA ---
export const metadata = {
  metadataBase: new URL('https://www.devsamp.online'), // Apna actual domain yahan dalein
  title: {
    default: "DevSamp | Creative Web & App Development Agency",
    template: "%s | DevSamp Agency"
  },
  description: "DevSamp is a premium digital agency providing Web Development, UI/UX Design, and App Solutions. We transform ideas into digital reality with Next.js and modern tech.",
  keywords: ["Web Development", "App Development", "UI/UX Design", "Next.js Agency", "React Developers", "Digital Agency India", "DevSamp", "Freelance Web Developer", "SEO Services"],
  authors: [{ name: "DevSamp Team", url: "https://www.devsamp.online" }],
  creator: "DevSamp",
  publisher: "DevSamp Agency",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "DevSamp | Modern Digital Agency",
    description: "Transforming ideas into digital reality. Expert Web & App Development services.",
    url: 'https://www.devsamp.online',
    siteName: 'DevSamp',
    images: [
      {
        url: '/icon-512.png', // Apna banner image yahan use karein
        width: 800,
        height: 600,
        alt: 'DevSamp Agency Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevSamp Agency',
    description: 'Transforming ideas into digital reality.',
    images: ['/icon-512.png'], 
    creator: '@devsamp1st',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DevSamp",
  },
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Accessibility ke liye zoom allow kiya hai
  userScalable: true,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning={true}>
      <head>
        {/* JSON-LD Schema for Organization SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "DevSamp",
              "url": "https://www.devsamp.online",
              "logo": "https://www.devsamp.online/icon-512.png",
              "sameAs": [
                "https://x.com/devsamp1st",
                "https://www.instagram.com/devsamp1st/",
                "https://www.youtube.com/@DevSamp1st",
                "https://www.freelancer.in/u/DevSamp"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9330680642",
                "contactType": "customer service",
                "email": "devsamp1st@gmail.com"
              }
            })
          }}
        />
      </head>
      <body 
        className={`${inter.variable} ${outfit.variable} bg-black text-white antialiased`}
        suppressHydrationWarning={true}
      >
        <Preloader />
        <ProgressBar />
        <WhatsAppBtn />
        <Chatbot />
        <CustomCursor />
        <Noise />
        <ScrollToTop />
        <Navbar />
        {children}
      </body>
    </html>
  );
}