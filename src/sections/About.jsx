"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Zap, 
  Target, 
  TrendingUp, 
  Code,
  ArrowUpRight
} from "lucide-react";

const About = () => {
  return (
    // Mobile: py-12 (compact), PC: py-24 (Original)
    <section id="about" className="relative py-12 md:py-24 bg-black text-white">
      
      {/* Mobile: px-4, PC: px-6 (Original) */}
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        {/* Mobile: mb-8, PC: mb-16 (Original) */}
        <div className="max-w-3xl mb-8 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4 md:mb-6"
          >
            We craft <span className="text-blue-500">digital excellence</span> with code & creativity.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            // Mobile: text-base, PC: text-lg (Original)
            className="text-gray-400 text-base md:text-lg leading-relaxed"
          >
            DevSamp isn't just an agency; it's a lab where ideas turn into high-performance software. 
            We bridge the gap between complex engineering and beautiful design.
          </motion.p>
        </div>

        {/* --- BENTO GRID LAYOUT --- */}
        {/* Mobile: gap-4 (App feel), PC: gap-6 (Original) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

          {/* Card 1: Main Image */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            // Mobile: h-[220px], PC: h-[400px] (Original)
            className="md:col-span-2 relative h-[220px] md:h-[400px] rounded-3xl overflow-hidden group border border-white/10"
          >
            <Image 
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop"
              alt="Cyberpunk Workspace"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            
            {/* Mobile: smaller padding/text, PC: Original padding/text */}
            <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8">
              <div className="bg-blue-600 w-fit px-3 py-1 rounded-full text-xs font-bold mb-2">SINCE 2021</div>
              <h3 className="text-xl md:text-2xl font-bold">Designing the Future</h3>
            </div>
          </motion.div>

          {/* Card 2: Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            // Mobile: p-5 flex-row (Widget style), PC: p-8 flex-col (Original)
            className="md:col-span-1 bg-white/5 border border-white/10 rounded-3xl p-5 md:p-8 flex flex-row md:flex-col justify-between items-center md:items-start hover:bg-white/10 transition-colors"
          >
            <div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mb-2 md:mb-6">
                <TrendingUp size={20} className="md:w-6 md:h-6" />
              </div>
              <h3 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">150+</h3>
              <p className="text-xs md:text-base text-gray-400">Projects Delivered</p>
            </div>
            
            {/* Mobile: vertical divider, PC: horizontal divider (Original) */}
            <div className="border-l pl-5 md:pl-0 md:border-l-0 md:border-t md:pt-8 border-white/10 md:mt-8 w-auto md:w-full">
              <h3 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">98%</h3>
              <p className="text-xs md:text-base text-gray-400">Client Retention</p>
            </div>
          </motion.div>

          {/* Card 3: Our Approach */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            // Mobile: p-6, PC: p-8 (Original)
            className="md:col-span-1 bg-gradient-to-br from-blue-900/40 to-black border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full"></div>
            
            <Target className="text-blue-400 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Strategy First</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              We don't just blindly code. We analyze your market, understand your users, and build solutions that actually sell.
            </p>
            <a href="#contact" className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-white transition-colors">
                Let's talk strategy <ArrowUpRight size={14} />
            </a>
          </motion.div>

          {/* Card 4: Tech Stack */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            // Mobile: p-6, PC: p-8 (Original)
            className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-center relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none"></div>

            <div className="flex items-center gap-3 mb-6 relative z-10">
                <Code className="text-pink-500" size={24} />
                <h3 className="text-xl font-bold">Our Tech Arsenal</h3>
            </div>
            
            {/* Auto Scrolling Tech Names */}
            <div className="w-full overflow-hidden relative z-10 mask-linear-fade">
                 <div className="flex gap-4 w-max animate-marquee">
                    {["Next.js", "React", "TypeScript", "Tailwind", "Node.js", "AWS", "Framer Motion", "Supabase", "GraphQL", "Figma"].map((tech, i) => (
                        <span key={i} className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-gray-300 text-sm font-mono whitespace-nowrap">
                            {tech}
                        </span>
                    ))}
                    {["Next.js", "React", "TypeScript", "Tailwind", "Node.js", "AWS", "Framer Motion", "Supabase", "GraphQL", "Figma"].map((tech, i) => (
                        <span key={`dup-${i}`} className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-gray-300 text-sm font-mono whitespace-nowrap">
                            {tech}
                        </span>
                    ))}
                 </div>
            </div>

            <style jsx>{`
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default About;