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
    <section id="about" className="relative py-24 bg-black text-white">
      
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            We craft <span className="text-blue-500">digital excellence</span> with code & creativity.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg leading-relaxed"
          >
            DevSamp isn't just an agency; it's a lab where ideas turn into high-performance software. 
            We bridge the gap between complex engineering and beautiful design.
          </motion.p>
        </div>

        {/* --- BENTO GRID LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: Main Image (Large) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden group border border-white/10"
          >
            <Image 
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop"
              alt="Cyberpunk Workspace"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8">
              <div className="bg-blue-600 w-fit px-3 py-1 rounded-full text-xs font-bold mb-2">SINCE 2021</div>
              <h3 className="text-2xl font-bold">Designing the Future</h3>
            </div>
          </motion.div>

          {/* Card 2: Stats (Tall) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:bg-white/10 transition-colors"
          >
            <div>
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-4xl font-bold mb-2">150+</h3>
              <p className="text-gray-400">Projects Delivered Successfully</p>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="text-4xl font-bold mb-2">98%</h3>
              <p className="text-gray-400">Client Retention Rate</p>
            </div>
          </motion.div>

          {/* Card 3: Our Approach (Wide) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-1 bg-gradient-to-br from-blue-900/40 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden group"
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

          {/* Card 4: Tech Stack (Marquee Effect) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden"
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
                    {/* Duplicate for Loop */}
                    {["Next.js", "React", "TypeScript", "Tailwind", "Node.js", "AWS", "Framer Motion", "Supabase", "GraphQL", "Figma"].map((tech, i) => (
                        <span key={`dup-${i}`} className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-gray-300 text-sm font-mono whitespace-nowrap">
                            {tech}
                        </span>
                    ))}
                 </div>
            </div>

            {/* CSS for Marquee (Inline for simplicity) */}
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