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
  metadataBase: new URL('https://www.devsamp.online'),
  title: {
    default: "DevSamp | Top Web Development & UI/UX Design Agency",
    template: "%s | DevSamp Agency"
  },
  description: "DevSamp is a premium digital agency providing custom Web Development, App Solutions, and UI/UX Design. Transform your ideas into digital reality with expert developers.",
  
  // --- GOOGLE VERIFICATION CODE ---
  verification: {
    google: 'D6c5A0ciZ3q-98yon-nn2GAVcNvwoKhWvCeYV9GT2Mg',
  },
  // --------------------------------

  keywords: ["Web Development", "App Development", "UI/UX Design", "Next.js Agency", "React Developers", "Digital Agency India", "DevSamp", "Freelance Web Developer", "SEO Services", "Website Design"],
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
    icon: '/icon-192.png',
    shortcut: '/icon-192.png',
    apple: '/icon-192.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/icon-192.png',
    },
  },
  openGraph: {
    title: "DevSamp | Modern Digital Agency",
    description: "Transforming ideas into digital reality. Expert Web & App Development services.",
    url: 'https://www.devsamp.online',
    siteName: 'DevSamp Agency',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
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
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }) {
  // Enhanced JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "DevSamp",
        "url": "https://www.devsamp.online",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.devsamp.online/icon-192.png",
          "width": 192,
          "height": 192,
          "caption": "DevSamp Agency Logo"
        },
        "image": "https://www.devsamp.online/icon-512.png",
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
          "email": "devsamp1st@gmail.com",
          "areaServed": "IN",
          "availableLanguage": ["en", "hi"]
        }
      },
      {
        "@type": "WebSite",
        "name": "DevSamp",
        "alternateName": ["DevSamp Agency", "DevSamp Web Solutions"],
        "url": "https://www.devsamp.online"
      }
    ]
  };

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning={true}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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