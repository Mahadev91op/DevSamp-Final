import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import Noise from "@/components/Noise";
import ScrollToTop from "@/components/ScrollToTop"; // <-- Import kiya

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
  title: "DevSamp | Modern Web Agency",
  description: "Transforming ideas into digital reality.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} bg-black text-white antialiased`}>
        
        <CustomCursor />
        <Noise />
        <ScrollToTop /> {/* <-- Yahan Add kar diya (Sabse upar ya niche kahi bhi rakh sakte hain) */}
        
        <Navbar />
        {children}
      </body>
    </html>
  );
}