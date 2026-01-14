"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mail, Phone, Send, ChevronDown, Check, Loader2 } from "lucide-react"; 

const servicesList = [
  "Web Development",
  "App Development",
  "UI/UX Design",
  "SEO & Marketing",
  "Cloud Solutions",
  "Other"
];

const Contact = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: ""
  });
  const [status, setStatus] = useState("idle");

  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleSelect = (service) => {
    setFormData({ ...formData, service });
    setIsOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneClick = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const phoneNumber = "919330680642";
    if (isMobile) {
      window.location.href = `tel:+${phoneNumber}`;
    } else {
      window.open(`https://wa.me/${phoneNumber}`, "_blank");
    }
  };

  const emailSubject = "Inquiry regarding a Project - DevSamp";
  const emailBody = "Hello DevSamp Team,%0D%0A%0D%0AI am interested in your services.";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.name || !formData.email || !formData.message) {
        alert("Please fill all fields!");
        return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => {
            router.push("/login");
        }, 1500);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    // CHANGE: py-12 for mobile, py-24 for PC
    <section id="contact" className="relative py-12 md:py-24 bg-black text-white overflow-hidden">
      
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* CHANGE: px-4 for mobile, px-6 for PC */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* CHANGE: gap-8 for mobile, gap-16 for PC */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start md:items-center">
          
          {/* LEFT SIDE */}
          <div>
            {/* CHANGE: text-3xl for mobile, text-6xl for PC */}
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tight"
            >
              Let's build something <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                extraordinary.
              </span>
            </motion.h2>

            {/* CHANGE: text-sm for mobile, text-lg for PC */}
            <p className="text-gray-400 text-sm md:text-lg mb-6 md:mb-10 max-w-md">
              Have an idea? Let's discuss how DevSamp can help your business grow.
            </p>

            {/* CHANGE: space-y-4 for mobile, space-y-6 for PC */}
            <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-3 md:gap-4 text-gray-300 group">
                    {/* CHANGE: Smaller icon box on mobile */}
                    <div className="p-2 md:p-3 bg-white/5 rounded-full border border-white/10 text-blue-500 group-hover:border-blue-500/50 transition-colors">
                        <Mail size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider">Email us at</p>
                        {/* CHANGE: text-base for mobile */}
                        <a href={`mailto:devsamp1st@gmail.com?subject=${emailSubject}&body=${emailBody}`} className="text-base md:text-lg font-medium group-hover:text-blue-400 transition-colors">
                            devsamp1st@gmail.com
                        </a>
                    </div>
                </div>

                <div onClick={handlePhoneClick} className="flex items-center gap-3 md:gap-4 text-gray-300 group cursor-pointer">
                    <div className="p-2 md:p-3 bg-white/5 rounded-full border border-white/10 text-purple-500 group-hover:border-purple-500/50 transition-colors">
                        <Phone size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider">Call or WhatsApp</p>
                        <p className="text-base md:text-lg font-medium group-hover:text-purple-400 transition-colors">
                            +91 9330680642
                        </p>
                    </div>
                </div>
            </div>
          </div>

          {/* RIGHT SIDE (FORM) */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            // CHANGE: p-5 for mobile, p-10 for PC. rounded-2xl for mobile.
            className="bg-white/5 border border-white/10 p-5 md:p-10 rounded-2xl md:rounded-3xl backdrop-blur-xl relative"
          >
            <AnimatePresence>
                {status === "success" && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 bg-black/90 backdrop-blur-md rounded-2xl md:rounded-3xl flex flex-col items-center justify-center text-center p-8"
                    >
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                            <Check size={32} className="md:w-10 md:h-10" strokeWidth={3} />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-2">Details Received!</h3>
                        <p className="text-gray-400 text-sm md:text-base">Redirecting to login...</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CHANGE: space-y-4 for mobile, space-y-6 for PC */}
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-1.5 md:space-y-2">
                        <label className="text-xs md:text-sm text-gray-400 ml-1">Your Name</label>
                        {/* CHANGE: px-4 py-3 for mobile (smaller inputs) */}
                        <input name="name" value={formData.name} onChange={handleChange} type="text" placeholder="John Doe" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-4 text-sm md:text-base text-white focus:outline-none focus:border-blue-500 transition-all" required />
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                        <label className="text-xs md:text-sm text-gray-400 ml-1">Your Email</label>
                        <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="john@example.com" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-4 text-sm md:text-base text-white focus:outline-none focus:border-blue-500 transition-all" required />
                    </div>
                </div>

                <div className="space-y-1.5 md:space-y-2 relative">
                    <label className="text-xs md:text-sm text-gray-400 ml-1">Service Interested In</label>
                    <div onClick={toggleDropdown} className={`w-full bg-black/40 border cursor-pointer rounded-xl px-4 py-3 md:px-5 md:py-4 text-white flex justify-between items-center transition-all ${isOpen ? 'border-blue-500' : 'border-white/10 hover:border-white/30'}`}>
                        <span className={`text-sm md:text-base ${formData.service ? "text-white" : "text-gray-600"}`}>{formData.service || "Select a Service"}</span>
                        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 md:w-5 md:h-5 ${isOpen ? "rotate-180" : "rotate-0"}`} />
                    </div>
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-50 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                                {servicesList.map((service, index) => (
                                    <div key={index} onClick={() => handleSelect(service)} className="px-4 py-2.5 md:px-5 md:py-3 text-sm md:text-base text-gray-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors">
                                        {service}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-1.5 md:space-y-2">
                    <label className="text-xs md:text-sm text-gray-400 ml-1">Message</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} rows={4} placeholder="Tell us about your project..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-4 text-sm md:text-base text-white focus:outline-none focus:border-blue-500 transition-all resize-none" required></textarea>
                </div>

                {/* CHANGE: py-3 for mobile, py-4 for PC */}
                <button type="submit" disabled={status === "loading"} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 md:py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 group disabled:opacity-70 disabled:cursor-not-allowed text-sm md:text-base">
                    {status === "loading" ? (<>Processing... <Loader2 className="animate-spin md:w-5 md:h-5" size={16} /></>) : (<>Get Started <Send size={16} className="group-hover:translate-x-1 transition-transform md:w-[18px] md:h-[18px]" /></>)}
                </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;