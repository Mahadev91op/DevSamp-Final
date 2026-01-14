"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    id: "01",
    question: "How much does a website cost?",
    answer: "Every project is unique. A basic website starts at $499, while custom web applications depend on the complexity. We provide a detailed quote after our initial discovery call."
  },
  {
    id: "02",
    question: "How long does it take to build a website?",
    answer: "On average, a standard business website takes 2-4 weeks. Larger custom projects or e-commerce platforms can take 6-10 weeks depending on the features required."
  },
  {
    id: "03",
    question: "Do you provide support after launch?",
    answer: "Absolutely! We offer 1 month of free support with every project to ensure everything runs smoothly. After that, you can subscribe to our maintenance packages."
  },
  {
    id: "04",
    question: "Will my website be mobile-friendly?",
    answer: "Yes. We follow a 'Mobile-First' approach. Your website will look and perform perfectly on all devices—phones, tablets, and desktops."
  },
  {
    id: "05",
    question: "Can I update the website content myself?",
    answer: "Yes! We build websites using modern CMS (Content Management Systems) or provide a custom dashboard, so you can easily edit text and images without coding."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0); // Pehla wala khula rakhenge

  return (
    // CHANGE: py-12 for mobile, py-24 for PC
    <section className="py-12 md:py-24 bg-black text-white relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* CHANGE: px-4 for mobile, px-6 for PC */}
      <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
        
        {/* Header */}
        {/* CHANGE: mb-8 for mobile, mb-16 for PC */}
        <div className="mb-8 md:mb-16 md:text-center">
          {/* CHANGE: Text sizes for mobile */}
          <h2 className="text-3xl md:text-6xl font-bold mb-2 md:mb-4">
            Common <span className="text-blue-500">Queries</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-lg">
            Got questions? We've got answers.
          </p>
        </div>

        {/* --- FAQ GRID --- */}
        {/* CHANGE: gap-3 for mobile (compact list), gap-6 for PC */}
        <div className="grid grid-cols-1 gap-3 md:gap-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              className={`group relative rounded-xl md:rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden ${
                activeIndex === index 
                  ? "bg-white/10 border-blue-500/50" 
                  : "bg-white/5 border-white/10 hover:border-white/30"
              }`}
            >
              
              {/* Question Header */}
              {/* CHANGE: p-4 for mobile, p-8 for PC. gap-3 for mobile, gap-6 for PC */}
              <div className="relative z-10 p-4 md:p-8 flex items-center gap-3 md:gap-6">
                
                {/* Numbering (01, 02) */}
                {/* CHANGE: text-lg for mobile, text-2xl for PC */}
                <span className={`text-lg md:text-2xl font-bold font-mono transition-colors duration-300 ${
                    activeIndex === index ? "text-blue-400" : "text-gray-600 group-hover:text-gray-400"
                }`}>
                    {faq.id}
                </span>

                {/* Question Text */}
                {/* CHANGE: text-sm for mobile, text-2xl for PC */}
                <h3 className={`flex-1 text-sm md:text-2xl font-semibold transition-colors duration-300 ${
                    activeIndex === index ? "text-white" : "text-gray-300 group-hover:text-white"
                }`}>
                  {faq.question}
                </h3>

                {/* Icon Button */}
                {/* CHANGE: Smaller icon box on mobile (w-8 h-8) */}
                <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border transition-all duration-300 ${
                    activeIndex === index 
                        ? "bg-blue-600 border-blue-600 rotate-180" 
                        : "border-white/20 group-hover:border-white"
                }`}>
                    {activeIndex === index ? <Minus size={16} className="md:w-5 md:h-5" /> : <Plus size={16} className="md:w-5 md:h-5" />}
                </div>
              </div>

              {/* Answer (Using Spring Animation for NO LAG) */}
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {/* CHANGE: 
                        - px-4 pb-4 for mobile 
                        - pl-4 for mobile (removes deep indentation), pl-[5.5rem] for PC (keeps indentation)
                        - text-sm for mobile
                    */}
                    <div className="px-4 pb-4 md:px-8 md:pb-8 pt-0 pl-4 md:pl-[5.5rem] text-gray-400 text-xs md:text-lg leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active Background Glow */}
              {activeIndex === index && (
                <div className="absolute inset-0 bg-blue-500/5 pointer-events-none"></div>
              )}

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQ;