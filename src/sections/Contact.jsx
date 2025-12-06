"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Phone, Send, ChevronDown, Check } from "lucide-react";

const servicesList = [
  "Web Development",
  "App Development",
  "UI/UX Design",
  "SEO & Marketing",
  "Cloud Solutions",
  "Other"
];

const Contact = () => {
  // Custom Dropdown State
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleSelect = (service) => {
    setSelectedService(service);
    setIsOpen(false);
  };

  return (
    <section id="contact" className="relative py-24 bg-black text-white overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* --- LEFT SIDE: INFO --- */}
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
            >
              Let's build something <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                extraordinary.
              </span>
            </motion.h2>

            <p className="text-gray-400 text-lg mb-10 max-w-md">
              Have an idea? Let's discuss how DevSamp can help your business grow with modern web technologies.
            </p>

            <div className="space-y-6">
                <div className="flex items-center gap-4 text-gray-300">
                    <div className="p-3 bg-white/5 rounded-full border border-white/10 text-blue-500">
                        <Mail size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Email us at</p>
                        <p className="text-lg font-medium">hello@devsamp.com</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-gray-300">
                    <div className="p-3 bg-white/5 rounded-full border border-white/10 text-purple-500">
                        <Phone size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Call us</p>
                        <p className="text-lg font-medium">+91 98765 43210</p>
                    </div>
                </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: FORM --- */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-3xl backdrop-blur-xl"
          >
            <form className="space-y-6" onClick={(e) => e.preventDefault()}>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">Your Name</label>
                        <input 
                            type="text" 
                            placeholder="John Doe"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">Your Email</label>
                        <input 
                            type="email" 
                            placeholder="john@example.com"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>

                {/* --- CUSTOM ANIMATED DROPDOWN --- */}
                <div className="space-y-2 relative">
                    <label className="text-sm text-gray-400 ml-1">Service Interested In</label>
                    
                    {/* Trigger Button */}
                    <div 
                        onClick={toggleDropdown}
                        className={`w-full bg-black/40 border cursor-pointer rounded-xl px-5 py-4 text-white flex justify-between items-center transition-all ${isOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-white/10 hover:border-white/30'}`}
                    >
                        <span className={selectedService ? "text-white" : "text-gray-600"}>
                            {selectedService || "Select a Service"}
                        </span>
                        <ChevronDown 
                            size={20} 
                            className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} 
                        />
                    </div>

                    {/* Dropdown Menu List */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute z-50 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
                            >
                                {servicesList.map((service, index) => (
                                    <div 
                                        key={index}
                                        onClick={() => handleSelect(service)}
                                        className="px-5 py-3 text-gray-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors flex justify-between items-center group"
                                    >
                                        {service}
                                        {selectedService === service && <Check size={16} className="text-white" />}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400 ml-1">Message</label>
                    <textarea 
                        rows={4}
                        placeholder="Tell us about your project..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                    ></textarea>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 group">
                    Send Message 
                    <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;