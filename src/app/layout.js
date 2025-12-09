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

// --- METADATA UPDATE FOR PWA ---
export const metadata = {
  title: "DevSamp | Modern Web Agency",
  description: "Transforming ideas into digital reality.",
  manifest: "/manifest.json", // <-- YE LINE ADD KI HAI
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DevSamp",
  },
};

// --- VIEWPORT SETTINGS (Theme Color) ---
export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning={true}>
      <body 
        className={`${inter.variable} ${outfit.variable} bg-black text-white antialiased`}
        suppressHydrationWarning={true}
      >
        
        {/* --- GLOBAL FEATURES --- */}
        <Preloader />
        <ProgressBar />
        <WhatsAppBtn />
        <Chatbot />
        
        <CustomCursor />
        <Noise />
        <ScrollToTop />
        
        {/* --- MAIN LAYOUT --- */}
        <Navbar />
        {children}
        
      </body>
    </html>
  );
}