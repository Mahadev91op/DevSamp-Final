"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Quote, Star } from "lucide-react";

// --- FAKE DATA (Client Reviews) ---
const testimonials = [
  {
    name: "Amit Sharma",
    role: "CEO, TechFlow",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "DevSamp ne hamari website ko bilkul badal diya. Unka design sense aur coding speed lajawab hai. Highly recommended!",
  },
  {
    name: "Sarah Jenkins",
    role: "Founder, Bloom Kart",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "The animations are buttery smooth! Our conversion rate increased by 40% after the redesign. Fantastic work.",
  },
  {
    name: "Rahul Verma",
    role: "CTO, NextGen",
    image: "https://randomuser.me/api/portraits/men/86.jpg",
    text: "Professional, fast, and clean code. They understood our requirement perfectly and delivered before the deadline.",
  },
  {
    name: "Emily Davis",
    role: "Marketing Head, Solace",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "I loved the holographic hover effects. It makes our brand look so premium. Will definitely hire again.",
  },
  {
    name: "Vikram Singh",
    role: "Director, EduPrime",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    text: "Technical SEO aur Performance optimization top notch hai. Hamari site ab Google par rank kar rahi hai.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 mb-12 text-center relative z-10">
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
        >
          Client <span className="text-blue-500">Stories</span>
        </motion.h2>
        <p className="text-gray-400">Don't just take our word for it.</p>
      </div>

      {/* --- INFINITE SCROLL WRAPPER --- */}
      <div className="relative w-full overflow-hidden">
        
        {/* Gradient Masks (Side Fade Effect) */}
        <div className="absolute top-0 left-0 w-24 md:w-48 h-full bg-gradient-to-r from-black to-transparent z-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-24 md:w-48 h-full bg-gradient-to-l from-black to-transparent z-20 pointer-events-none"></div>

        {/* Moving Track */}
        <motion.div
          className="flex gap-8 w-max"
          // Logic: -50% tak move karega fir reset hoga (Seamless Loop)
          animate={{ x: "-50%" }}
          transition={{ 
            duration: 30, // Speed (Higher = Slower)
            ease: "linear", 
            repeat: Infinity 
          }}
        >
          {/* Double map to create seamless loop */}
          {[...testimonials, ...testimonials].map((item, index) => (
            <div
              key={index}
              className="w-[350px] md:w-[450px] p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors flex flex-col justify-between"
            >
              <div>
                <Quote className="text-blue-500 mb-4 opacity-50" size={40} />
                <p className="text-lg text-gray-300 leading-relaxed mb-6">"{item.text}"</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-white">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
                <div className="ml-auto flex gap-1">
                    {[1,2,3,4,5].map(s => (
                        <Star key={s} size={14} className="text-yellow-500 fill-yellow-500" />
                    ))}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

    </section>
  );
};

export default Testimonials;