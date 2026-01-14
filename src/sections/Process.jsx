"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, PenTool, Code2, Rocket, ShieldCheck } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Discovery & Strategy",
    desc: "We dive deep into your business model, understand your audience, and map out a roadmap for success.",
    icon: <Search size={24} className="w-5 h-5 md:w-6 md:h-6" />, // Icon size responsive
    color: "bg-blue-500"
  },
  {
    id: "02",
    title: "UI/UX Design",
    desc: "We create wireframes and high-fidelity prototypes. This is where your vision gets its visual identity.",
    icon: <PenTool size={24} className="w-5 h-5 md:w-6 md:h-6" />,
    color: "bg-purple-500"
  },
  {
    id: "03",
    title: "Development",
    desc: "Our coders take over. We build scalable, clean, and fast code using Next.js and modern tech stacks.",
    icon: <Code2 size={24} className="w-5 h-5 md:w-6 md:h-6" />,
    color: "bg-pink-500"
  },
  {
    id: "04",
    title: "Testing & QA",
    desc: "We rigorously test for bugs, performance issues, and responsiveness across all devices.",
    icon: <ShieldCheck size={24} className="w-5 h-5 md:w-6 md:h-6" />,
    color: "bg-green-500"
  },
  {
    id: "05",
    title: "Launch & Support",
    desc: "We deploy your site to the world and provide ongoing support to keep it running smoothly.",
    icon: <Rocket size={24} className="w-5 h-5 md:w-6 md:h-6" />,
    color: "bg-orange-500"
  },
];

const Process = () => {
  const containerRef = useRef(null);
  
  // Scroll track karna
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Glowing Line ki height badhana scroll ke saath
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    // CHANGE: py-12 for mobile, py-24 for PC
    <section id="process" ref={containerRef} className="relative py-12 md:py-24 bg-black text-white overflow-hidden">
      
      {/* CHANGE: px-4 for mobile, px-6 for PC */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header */}
        {/* CHANGE: mb-10 for mobile, mb-20 for PC */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4 md:mb-6"
          >
            Our Process For <br />
            <span className="text-blue-500">Delivering Results</span>
          </motion.h2>
          <p className="text-gray-400 text-sm md:text-base">
            From chaos to clarity. We follow a proven 5-step framework to ensure your project is delivered on time.
          </p>
        </div>

        {/* --- TIMELINE CONTAINER --- */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* Central Line (Background - Gray) */}
          {/* CHANGE: left-4 for mobile (tighter layout), left-1/2 for PC */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 -translate-x-1/2 md:translate-x-0"></div>
          
          {/* Central Line (Foreground - Glowing Blue - Animated) */}
          {/* CHANGE: left-4 for mobile, left-1/2 for PC */}
          <motion.div 
            style={{ height: lineHeight }}
            className="absolute left-4 md:left-1/2 top-0 w-[2px] bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 -translate-x-1/2 md:translate-x-0 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
          ></motion.div>

          {/* Steps Loop */}
          {/* CHANGE: space-y-6 for mobile (compact), space-y-24 for PC */}
          <div className="space-y-6 md:space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex items-center md:justify-between ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                
                {/* 1. Blank Space for Desktop Alignment (Takes 50% width) */}
                <div className="hidden md:block w-5/12"></div>

                {/* 2. Center Node (The Dot on the Line) */}
                {/* CHANGE: left-4 for mobile, left-1/2 for PC. Size reduced for mobile. */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                    <div className={`w-6 h-6 md:w-12 md:h-12 rounded-full border-2 md:border-4 border-black ${step.color} shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center text-white font-bold text-[10px] md:text-base`}>
                        {step.id}
                    </div>
                </div>

                {/* 3. The Content Card */}
                {/* CHANGE: pl-12 for mobile (to fit next to left-4 line), pl-0 for PC */}
                <div className="pl-12 md:pl-0 w-full md:w-5/12">
                  {/* CHANGE: p-5 for mobile, p-8 for PC */}
                  <div className="group relative bg-white/5 border border-white/10 p-5 md:p-8 rounded-2xl hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300">
                    
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>

                    {/* CHANGE: w-10 h-10 for mobile, w-12 h-12 for PC */}
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${step.color} bg-opacity-20 flex items-center justify-center mb-3 md:mb-4 text-white border border-white/10`}>
                        {step.icon}
                    </div>

                    {/* CHANGE: text-lg for mobile, text-xl for PC */}
                    <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 group-hover:text-blue-400 transition-colors">
                        {step.title}
                    </h3>
                    {/* CHANGE: text-xs for mobile, text-sm for PC */}
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                        {step.desc}
                    </p>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Process;