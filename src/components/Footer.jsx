"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  ArrowUpRight 
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-24 overflow-hidden relative border-t border-white/10">
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- TOP CTA --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 pb-12 border-b border-white/10">
            <div className="max-w-2xl">
                <h2 className="text-4xl md:text-7xl font-bold leading-tight mb-6">
                    Have an idea? <br />
                    <span className="text-gray-500">Let's build it.</span>
                </h2>
            </div>
            
            <a href="#contact">
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-8 md:mt-0 px-10 py-5 rounded-full bg-white text-black font-bold text-xl flex items-center gap-3 hover:bg-blue-500 hover:text-white transition-all duration-300 group"
                >
                    Start Project
                    <ArrowUpRight className="group-hover:rotate-45 transition-transform duration-300" />
                </motion.button>
            </a>
        </div>

        {/* --- LINKS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
            
            {/* 1. Address (Span 4) */}
            <div className="md:col-span-4">
                <Link href="/" className="text-3xl font-bold tracking-tighter text-white mb-6 block">
                    DEV<span className="text-blue-500">SAMP</span>
                </Link>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                    A digital product agency crafting world-class websites and apps. 
                    Based in India, working globally.
                </p>
                <div className="flex gap-4">
                    <a href="#" className="p-3 rounded-full bg-white/5 hover:bg-blue-600 transition-colors"><Linkedin size={20} /></a>
                    <a href="#" className="p-3 rounded-full bg-white/5 hover:bg-black hover:text-white transition-colors"><Github size={20} /></a>
                    <a href="#" className="p-3 rounded-full bg-white/5 hover:bg-blue-400 transition-colors"><Twitter size={20} /></a>
                    <a href="#" className="p-3 rounded-full bg-white/5 hover:bg-pink-600 transition-colors"><Instagram size={20} /></a>
                </div>
            </div>

            {/* 2. Company Links (Span 2) - New Sections Added */}
            <div className="md:col-span-2 md:col-start-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Company</h4>
                <div className="flex flex-col gap-4">
                    <Link href="#about" className="text-gray-300 hover:text-white transition-colors">About</Link>
                    <Link href="#team" className="text-gray-300 hover:text-white transition-colors">Our Team</Link>
                    <Link href="#process" className="text-gray-300 hover:text-white transition-colors">Process</Link>
                    <Link href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
                </div>
            </div>

            {/* 3. Explore Links (Span 2) - Pricing/FAQ Added */}
            <div className="md:col-span-2">
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Explore</h4>
                <div className="flex flex-col gap-4">
                    <Link href="#services" className="text-gray-300 hover:text-white transition-colors">Services</Link>
                    <Link href="#work" className="text-gray-300 hover:text-white transition-colors">Portfolio</Link>
                    <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
                    <Link href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link>
                </div>
            </div>

             {/* 4. Contact Info (Span 3) */}
             <div className="md:col-span-3">
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Contact</h4>
                <p className="text-xl font-medium text-white mb-2">hello@devsamp.com</p>
                <p className="text-xl font-medium text-white">+91 98765 43210</p>
            </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 mb-8">
            <p>&copy; {new Date().getFullYear()} DevSamp Agency.</p>
            <div className="flex gap-8 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
        </div>

      </div>

      {/* BACKGROUND TEXT */}
      <div className="w-full flex justify-center overflow-hidden pointer-events-none">
        <h1 className="text-[18vw] font-bold text-white/5 leading-none select-none">
            DEVSAMP
        </h1>
      </div>

    </footer>
  );
};

export default Footer;