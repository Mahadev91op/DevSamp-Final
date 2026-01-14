"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Youtube, 
  Instagram, 
  ArrowUpRight,
  Bird 
} from "lucide-react";

// X (Twitter) Icon
const XIcon = ({ size = 20, className }) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const Footer = () => {
  const handlePhoneClick = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const phoneNumber = "919330680642";
    const message = "Hello DevSamp, I checked your website and would like to discuss a project.";

    if (isMobile) {
      window.location.href = `tel:+${phoneNumber}`;
    } else {
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
    }
  };

  const emailAddress = "devsamp1st@gmail.com";
  const subject = "Project Inquiry - DevSamp";
  const body = "Hello Team,\n\nI am interested in your services.\n\nName:\nProject Details:\n\nThanks.";
  const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    // Mobile: pb-20 (Space for absolute text), PC: pb-0 (Normal flow)
    <footer className="bg-black text-white pt-12 pb-20 md:pt-24 md:pb-0 overflow-hidden relative border-t border-white/10">
      
      <motion.div 
        className="container mx-auto px-4 md:px-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        
        {/* --- TOP CTA --- */}
        <motion.div 
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 md:mb-24 md:pb-12 border-b border-white/10"
        >
            <div className="max-w-2xl">
                <h2 className="text-3xl md:text-7xl font-bold leading-tight mb-4 md:mb-6">
                    Have an idea? <br />
                    <span className="text-gray-500">Let's build it.</span>
                </h2>
            </div>
            
            <Link href="/#contact" className="w-full md:w-auto">
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 md:mt-0 w-full md:w-auto px-6 py-3 md:px-10 md:py-5 rounded-full bg-white text-black font-bold text-base md:text-xl flex justify-center md:justify-start items-center gap-2 md:gap-3 hover:bg-blue-500 hover:text-white transition-all duration-300 group"
                >
                    Start Project
                    <ArrowUpRight className="group-hover:rotate-45 transition-transform duration-300 w-5 h-5 md:w-6 md:h-6" />
                </motion.button>
            </Link>
        </motion.div>

        {/* --- LINKS GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-24">
            
            {/* 1. Address */}
            <motion.div variants={itemVariants} className="col-span-2 md:col-span-4">
                <Link href="/" className="text-2xl md:text-3xl font-bold tracking-tighter text-white mb-3 md:mb-6 block">
                    DEV<span className="text-blue-500">SAMP</span>
                </Link>
                <p className="text-gray-400 text-sm md:text-lg leading-relaxed mb-4 md:mb-6 max-w-sm md:max-w-none">
                    A digital product agency crafting world-class websites and apps. 
                    Based in India, working globally.
                </p>
                <div className="flex gap-3 md:gap-4">
                    {[
                        { href: "https://www.freelancer.in/u/DevSamp", icon: <Bird size={18} className="md:w-5 md:h-5" />, color: "hover:bg-blue-600" },
                        { href: "https://www.youtube.com/@DevSamp1st", icon: <Youtube size={18} className="md:w-5 md:h-5" />, color: "hover:bg-red-600" },
                        { href: "https://x.com/devsamp1st", icon: <XIcon size={18} className="md:w-5 md:h-5" />, color: "hover:bg-white hover:text-black" },
                        { href: "https://www.instagram.com/devsamp1st/", icon: <Instagram size={18} className="md:w-5 md:h-5" />, color: "hover:bg-pink-600" }
                    ].map((social, index) => (
                        <motion.a 
                            key={index}
                            href={social.href} 
                            target="_blank" 
                            className={`p-2.5 md:p-3 rounded-full bg-white/5 ${social.color} transition-colors`}
                            whileHover={{ y: -5 }}
                        >
                            {social.icon}
                        </motion.a>
                    ))}
                </div>
            </motion.div>

            {/* 2. Company Links */}
            <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 md:col-start-6">
                <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 md:mb-6">Company</h4>
                <div className="flex flex-col gap-3 md:gap-4">
                    {["About", "Our Team", "Process", "Contact"].map((item) => (
                        <Link 
                            key={item} 
                            href={`/#${item.toLowerCase().replace(" ", "")}`} 
                            className="block w-fit text-sm md:text-base text-gray-300 hover:text-white transition-colors"
                        >
                            <motion.span whileHover={{ x: 5 }} className="inline-block">
                                {item}
                            </motion.span>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* 3. Explore Links */}
            <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
                <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 md:mb-6">Explore</h4>
                <div className="flex flex-col gap-3 md:gap-4">
                    {[
                        { name: "Services", href: "/#services" },
                        { name: "Portfolio", href: "/projects" },
                        { name: "Pricing", href: "/#pricing" },
                        { name: "Blog", href: "/blog" }
                    ].map((item) => (
                        <Link 
                            key={item.name} 
                            href={item.href} 
                            className="block w-fit text-sm md:text-base text-gray-300 hover:text-white transition-colors"
                        >
                            <motion.span whileHover={{ x: 5 }} className="inline-block">
                                {item.name}
                            </motion.span>
                        </Link>
                    ))}
                </div>
            </motion.div>

             {/* 4. Contact Info */}
             <motion.div variants={itemVariants} className="col-span-2 md:col-span-3">
                <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 md:mb-6">Contact</h4>
                <a 
                    href={mailtoLink}
                    className="block w-fit text-lg md:text-xl font-medium text-white mb-2 hover:text-blue-400 transition-colors"
                >
                    <motion.span whileHover={{ x: 5 }} className="inline-block">
                        devsamp1st@gmail.com
                    </motion.span>
                </a>
                <p 
                    onClick={handlePhoneClick}
                    className="w-fit text-lg md:text-xl font-medium text-white cursor-pointer hover:text-purple-400 transition-colors"
                >
                    <motion.span whileHover={{ x: 5 }} className="inline-block">
                        +91 9330680642
                    </motion.span>
                </p>
            </motion.div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <motion.div 
            variants={itemVariants}
            className="border-t border-white/10 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm text-gray-500 mb-6 md:mb-8 gap-3 md:gap-0"
        >
            <p>&copy; {new Date().getFullYear()} DevSamp Agency.</p>
            <div className="flex gap-6 md:gap-8">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
            </div>
        </motion.div>

      </motion.div>

      {/* BACKGROUND TEXT */}
      {/* FIX: Mobile = Absolute Bottom, PC = Static (Normal Flow like original) */}
      <div className="w-full flex justify-center overflow-hidden pointer-events-none absolute bottom-0 md:static md:bottom-auto z-0">
        <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-[15vw] md:text-[18vw] font-bold text-white/5 leading-none select-none"
        >
            DEVSAMP
        </motion.h1>
      </div>

    </footer>
  );
};

export default Footer;