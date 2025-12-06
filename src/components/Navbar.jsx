"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

// ✅ UPDATED LINKS LIST
const navLinks = [
  { name: "Services", href: "#services" },
  { name: "Process", href: "#process" }, // New
  { name: "Work", href: "#work" },
  { name: "Pricing", href: "#pricing" }, // New
  { name: "About", href: "#about" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Animation Variants
  const menuVariants = {
    closed: { x: "100%", transition: { duration: 0.4, ease: "easeInOut" } },
    open: { x: 0, transition: { duration: 0.4, ease: "easeInOut" } }
  };

  const linkVariants = {
    closed: { opacity: 0, y: 20 },
    open: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.1, duration: 0.4 } })
  };

  return (
    <nav
      className={`fixed w-full z-50 top-0 start-0 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        
        {/* LOGO */}
        <Link href="/" className="z-50 relative group">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold tracking-tighter text-white"
            >
              DEV<span className="text-blue-500 group-hover:text-purple-500 transition-colors">SAMP</span>
            </motion.div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link, index) => (
            <Link 
              key={index} 
              href={link.href} 
              className="relative text-sm font-medium text-gray-300 hover:text-white transition-colors group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
          
          <Link href="#contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              Let's Talk
            </motion.button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden z-50">
          <button onClick={toggleMenu} className="text-white focus:outline-none p-2">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center space-y-8"
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={linkVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                    <Link 
                        href={link.href} 
                        onClick={toggleMenu}
                        className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 hover:to-blue-500 transition-all"
                    >
                    {link.name}
                    </Link>
                </motion.div>
              ))}
              
              <motion.div variants={linkVariants} custom={6} initial="closed" animate="open">
                <Link href="#contact" onClick={toggleMenu} className="px-8 py-3 border border-white/20 rounded-full text-white text-xl">
                  Contact Us
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </nav>
  );
};

export default Navbar;