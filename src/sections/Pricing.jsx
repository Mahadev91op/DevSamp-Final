"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, X, Zap } from "lucide-react";

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [billing, setBilling] = useState("monthly");

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await fetch("/api/pricing");
        const data = await res.json();
        setPlans(data.pricing || []);
      } catch (error) {
        console.error("Failed to fetch pricing", error);
      }
    };
    fetchPricing();
  }, []);

  return (
    <section id="pricing" className="py-12 md:py-24 bg-black text-white relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
            Simple, Transparent <span className="text-blue-500">Pricing</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-lg mb-6 md:mb-8">
            Choose the perfect plan for your business needs. No hidden fees.
          </p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-bold ${billing === "monthly" ? "text-white" : "text-gray-500"}`}>
                Monthly
            </span>
            <button
                onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
                className="relative w-14 h-7 md:w-16 md:h-8 rounded-full bg-white/10 border border-white/20 p-1 transition-colors hover:border-blue-500/50"
            >
                <motion.div 
                    layout 
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-500 shadow-lg ${
                        billing === "yearly" ? "translate-x-7 md:translate-x-8" : "translate-x-0"
                    }`}
                />
            </button>
            <span className={`text-sm font-bold ${billing === "yearly" ? "text-white" : "text-gray-500"}`}>
                Yearly <span className="text-[10px] md:text-xs text-green-400 ml-1 font-normal">(Save ~20%)</span>
            </span>
          </div>
        </div>

        {/* Cards Grid / Carousel */}
        {/* FIX: Added 'pt-6' here so the 'Most Popular' badge doesn't get cut off on mobile */}
        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pt-6 pb-6 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 items-stretch md:items-start">
          {plans.map((plan, index) => (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className={`relative flex-shrink-0 w-[85vw] md:w-auto md:flex-shrink snap-center p-6 md:p-8 rounded-2xl md:rounded-3xl border transition-all duration-300 flex flex-col h-auto md:h-full ${
                plan.popular 
                    ? "bg-white/10 border-blue-500/50 shadow-[0_0_30px_rgba(37,99,235,0.15)] z-10 md:scale-105" 
                    : "bg-white/5 border-white/10 hover:border-white/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 px-3 py-1 md:px-4 md:py-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase shadow-lg whitespace-nowrap">
                    Most Popular
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xl md:text-2xl font-bold">{plan.name}</h3>
                <p className="text-xs md:text-sm text-gray-400 mt-2 min-h-[30px] md:min-h-[40px]">{plan.desc}</p>
              </div>

              <div className="mb-6 md:mb-8 flex items-end gap-1">
                <span className="text-3xl md:text-4xl font-bold text-white">
                    ${billing === "monthly" ? plan.priceMonthly : plan.priceYearly}
                </span>
                <span className="text-sm md:text-base text-gray-500 mb-1">/{billing === "monthly" ? "mo" : "yr"}</span>
              </div>

              <Link href="#contact" className={`w-full py-3 md:py-4 rounded-xl font-bold mb-6 md:mb-8 transition-all flex items-center justify-center gap-2 text-sm md:text-base ${
                plan.popular 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25" 
                    : "bg-white text-black hover:bg-gray-200"
              }`}>
                {plan.popular && <Zap size={16} className="md:w-[18px] md:h-[18px]" fill="currentColor" />}
                Get Started
              </Link>

              <div className="space-y-3 md:space-y-4 flex-grow">
                {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className={`p-1 rounded-full ${plan.popular ? "bg-blue-500/20 text-blue-400" : "bg-white/10 text-gray-300"}`}>
                            <Check size={10} className="md:w-3 md:h-3" strokeWidth={3} />
                        </div>
                        <span className="text-xs md:text-sm text-gray-300">{feature}</span>
                    </div>
                ))}
                {plan.missing && plan.missing.map((feature, i) => (
                    <div key={`miss-${i}`} className="flex items-center gap-3 opacity-40">
                        <div className="p-1 rounded-full bg-white/5 text-gray-500">
                            <X size={10} className="md:w-3 md:h-3" strokeWidth={3} />
                        </div>
                        <span className="text-xs md:text-sm text-gray-500">{feature}</span>
                    </div>
                ))}
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Pricing;