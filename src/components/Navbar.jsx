"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LayoutDashboard, Settings, LogOut, ChevronDown } from "lucide-react";

// Nav Links (Original)
const navLinks = [
  { name: "Services", href: "/#services" },
  { name: "Work", href: "/#work" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/#about" },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileHovered, setIsProfileHovered] = useState(false); // Hover State

  // --- LOGIN CHECK LOGIC ---
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
      else setUser(null);
    };
    checkUser();
    
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    setUser(null);
    router.push("/login");
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  const toggleMenu = () => setIsOpen(!isOpen);

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
      className={`fixed w-full z-[1000] top-0 start-0 transition-all duration-300 ${
        isOpen 
          ? "bg-black py-5 border-b border-white/10"
          : scrolled
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
          
          {/* USER PROFILE DROPDOWN (DESKTOP) */}
          {user ? (
             <div 
                className="relative"
                onMouseEnter={() => setIsProfileHovered(true)}
                onMouseLeave={() => setIsProfileHovered(false)}
             >
                {/* Profile Trigger */}
                <motion.div 
                    className="flex items-center gap-2 cursor-pointer bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-1.5 rounded-full transition-all"
                    whileHover={{ scale: 1.05 }}
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-white max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileHovered ? "rotate-180" : ""}`} />
                </motion.div>

                {/* Dropdown Menu */}
                <AnimatePresence>
                    {isProfileHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-full mt-2 w-56 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[60]"
                        >
                            <div className="p-4 border-b border-white/5 bg-white/5">
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Signed in as</p>
                                <p className="text-sm text-white font-medium truncate">{user.email}</p>
                            </div>
                            <div className="p-2">
                                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                                    <LayoutDashboard size={16} className="text-blue-500"/> Dashboard
                                </Link>
                                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                                    <Settings size={16} className="text-purple-500"/> Edit Profile
                                </Link>
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors mt-1">
                                    <LogOut size={16}/> Logout
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
             </div>
          ) : (
             <Link href="#contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg hover:shadow-blue-500/25 transition-all"
                >
                  Let's Talk
                </motion.button>
             </Link>
          )}
        </div>

        {/* Mobile Toggle Button */}
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
              
              {/* MOBILE USER ACTIONS */}
              <motion.div variants={linkVariants} custom={6} initial="closed" animate="open" className="flex flex-col items-center gap-4 mt-4 w-full px-10">
                {user ? (
                    <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3 shadow-lg">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{user.name}</h3>
                        <p className="text-gray-500 text-sm mb-6">{user.email}</p>
                        
                        <div className="flex flex-col gap-3">
                            <Link href="/dashboard" onClick={toggleMenu} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                                <LayoutDashboard size={18}/> Dashboard
                            </Link>
                            <Link href="/dashboard" onClick={toggleMenu} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                                <Settings size={18}/> Edit Profile
                            </Link>
                            <button onClick={handleLogout} className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-xl flex items-center justify-center gap-2 border border-red-500/20">
                                <LogOut size={18}/> Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <Link href="#contact" onClick={toggleMenu} className="px-8 py-3 border border-white/20 rounded-full text-white text-xl w-full text-center hover:bg-white/10 transition-colors">
                      Let's Talk
                    </Link>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </nav>
  );
};

export default Navbar;