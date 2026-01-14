"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Quote, Star, Plus, X, Loader2, Send } from "lucide-react";

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", rating: 5, text: "" });

  // Auto-Scroll Refs (For Both PC & Mobile)
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch Reviews
  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // --- UNIFIED AUTO-SCROLL LOGIC (PC + MOBILE) ---
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId;
    
    const scroll = () => {
      if (!isPaused && scrollContainer) {
        // Infinite Loop Logic
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
            scrollContainer.scrollLeft = 0;
        } else {
            scrollContainer.scrollLeft += 0.8; // Speed controlled here (0.8 is smooth)
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, reviews]); // Dependency on reviews allows recalculation when loaded

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
        setForm({ name: "", role: "", rating: 5, text: "" });
        setIsModalOpen(false);
        fetchReviews();
        alert("Thanks for your feedback!");
    }
    setLoading(false);
  };

  // Content Duplicate for Infinite Loop Effect
  const displayReviews = reviews.length < 5 ? [...reviews, ...reviews, ...reviews] : reviews;
  // Double duplication ensures smooth loop without visual jumps
  const loopedReviews = [...displayReviews, ...displayReviews];

  return (
    <section className="py-12 md:py-24 bg-black text-white relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[150px] md:w-[600px] md:h-[300px] bg-blue-500/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 mb-8 md:mb-12 text-center relative z-10">
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-2 md:mb-4"
        >
          Client <span className="text-blue-500">Stories</span>
        </motion.h2>
        <p className="text-gray-400 text-sm md:text-base mb-6 md:mb-8">Don't just take our word for it.</p>
        
        <button 
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 md:px-6 md:py-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2 mx-auto text-xs md:text-sm font-bold"
        >
            <Plus size={14} className="md:w-4 md:h-4"/> Write a Review
        </button>
      </div>

      {/* --- UNIFIED CAROUSEL VIEW (Mobile + PC) --- */}
      <div 
        ref={scrollRef}
        // Unified container styles
        className="flex overflow-x-auto gap-4 md:gap-8 px-4 md:px-0 pb-6 -mx-4 md:mx-0 scrollbar-hide items-stretch w-full"
        // Pause on interactions
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {loopedReviews.length > 0 ? (
            loopedReviews.map((item, index) => (
                <div
                key={`${item._id}-${index}`}
                // CHANGE: 
                // Mobile: w-[85vw] (Full width focus)
                // PC: w-[450px] (Standard card size)
                className="flex-shrink-0 w-[85vw] md:w-[450px] p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col justify-between hover:bg-white/10 transition-colors"
                >
                <div>
                    <Quote className="text-blue-500 mb-3 md:mb-4 opacity-50" size={24} />
                    {/* Responsive text size */}
                    <p className="text-sm md:text-lg text-gray-300 leading-relaxed mb-4 md:mb-6 line-clamp-4 md:line-clamp-none">"{item.text}"</p>
                </div>
                
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
                    <Image src={item.image || "https://randomuser.me/api/portraits/lego/1.jpg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="overflow-hidden">
                    <h4 className="font-bold text-white text-sm md:text-base truncate">{item.name}</h4>
                    <p className="text-xs md:text-sm text-gray-500 truncate">{item.role}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5 md:gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className={`md:w-[14px] md:h-[14px] ${i < item.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"}`} />
                        ))}
                    </div>
                </div>
                </div>
            ))
        ) : (
            <div className="w-full text-center text-gray-500 text-sm py-4">No reviews yet. Be the first!</div>
        )}
      </div>

      {/* --- REVIEW MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#111] border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-3xl w-full max-w-lg shadow-2xl">
                    <div className="flex justify-between items-center mb-4 md:mb-6">
                        <h3 className="text-lg md:text-xl font-bold">Share your Experience</h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X size={20} className="md:w-6 md:h-6"/></button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                        <input className="w-full bg-black border border-white/20 p-3 rounded-xl text-white outline-none text-sm md:text-base" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your Name" required />
                        <input className="w-full bg-black border border-white/20 p-3 rounded-xl text-white outline-none text-sm md:text-base" value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="Designation (e.g. CEO)" />
                        
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-gray-400 text-xs md:text-sm">Rating:</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                    key={star} 
                                    size={20} 
                                    className={`cursor-pointer transition-colors md:w-6 md:h-6 ${star <= form.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"}`}
                                    onClick={() => setForm({...form, rating: star})}
                                />
                            ))}
                        </div>

                        <textarea className="w-full bg-black border border-white/20 p-3 rounded-xl text-white outline-none h-24 md:h-32 text-sm md:text-base" value={form.text} onChange={e => setForm({...form, text: e.target.value})} placeholder="Write your feedback..." required />
                        
                        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 md:py-3 rounded-xl font-bold flex justify-center gap-2 text-sm md:text-base">
                            {loading ? <Loader2 className="animate-spin" /> : <><Send size={16} className="md:w-[18px] md:h-[18px]"/> Submit Review</>}
                        </button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default Testimonials;