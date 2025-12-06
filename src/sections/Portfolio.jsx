"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";

// --- DUMMY DATA (Project List) ---
const projects = [
  {
    id: 1,
    title: "FinTech Dashboard",
    category: "Web App",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
    tech: ["Next.js", "Chart.js", "Tailwind"],
    link: "#"
  },
  {
    id: 2,
    title: "E-Commerce Nike Store",
    category: "E-Commerce",
    image: "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?q=80&w=1000&auto=format&fit=crop",
    tech: ["Shopify", "React", "Stripe"],
    link: "#"
  },
  {
    id: 3,
    title: "Travel App UI",
    category: "Mobile App",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop",
    tech: ["React Native", "Firebase"],
    link: "#"
  },
  {
    id: 4,
    title: "Crypto Landing Page",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1621504450168-b8c4375361fe?q=80&w=1000&auto=format&fit=crop",
    tech: ["Framer Motion", "WebGL"],
    link: "#"
  },
  {
    id: 5,
    title: "AI Chat Bot",
    category: "Web App",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1000&auto=format&fit=crop",
    tech: ["OpenAI API", "Node.js"],
    link: "#"
  },
  {
    id: 6,
    title: "Real Estate Platform",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop",
    tech: ["Next.js", "MongoDB"],
    link: "#"
  },
];

const categories = ["All", "Web Design", "Web App", "Mobile App", "E-Commerce"];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  return (
    <section id="work" className="py-24 bg-black relative">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-white mb-2"
            >
              Selected <span className="text-blue-500">Works</span>
            </motion.h2>
            <p className="text-gray-400">Check out some of our latest projects.</p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                  activeCategory === cat
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-gray-400 border-white/10 hover:border-white/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid (Layout Animation) */}
        <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative h-[300px] w-full overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                </div>

                {/* Content (Bottom Overlay) */}
                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">
                    {project.category}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                  
                  {/* Tech Stack Tags */}
                  <div className="flex gap-2 mb-4">
                    {project.tech.map((t, i) => (
                        <span key={i} className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-300">
                            {t}
                        </span>
                    ))}
                  </div>

                  {/* Links (Hidden until hover) */}
                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    <button className="flex items-center gap-1 text-sm font-medium text-white hover:text-blue-400 transition-colors">
                        View Project <ExternalLink size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <Github size={20} />
                    </button>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All Button */}
        <div className="mt-16 flex justify-center">
            <button className="px-8 py-3 border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all">
                View All Projects
            </button>
        </div>

      </div>
    </section>
  );
};

export default Portfolio;