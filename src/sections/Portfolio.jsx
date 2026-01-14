"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link"; 
import { ExternalLink } from "lucide-react";

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };
    fetchProjects();
  }, []);

  const categories = ["All", ...new Set(projects.map(p => p.category))];

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);
  
  const displayedProjects = filteredProjects.slice(0, 6); 

  return (
    <section id="work" className="py-12 md:py-24 bg-black relative">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-12 gap-4 md:gap-6">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-5xl font-bold text-white mb-1 md:mb-2"
            >
              Selected <span className="text-blue-500">Works</span>
            </motion.h2>
            <p className="text-gray-400 text-sm md:text-base">Check out some of our latest projects.</p>
          </div>

          {/* Filter Buttons */}
          <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <div className="flex gap-2 whitespace-nowrap">
                {categories.map((cat, idx) => (
                <button
                    key={idx}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border ${
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
        </div>

        {/* Projects Grid */}
        {/* CHANGE: grid-cols-2 for mobile (2 cards per line), grid-cols-3 for PC */}
        {/* CHANGE: gap-3 for mobile (compact), gap-8 for PC */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          <AnimatePresence>
            {displayedProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={project._id}
                className="group relative rounded-xl md:rounded-2xl overflow-hidden cursor-pointer bg-white/5 border border-white/10"
              >
                {/* Image Container */}
                {/* CHANGE: h-[140px] for mobile (smaller height), h-[300px] for PC */}
                <div className="relative h-[140px] md:h-[300px] w-full overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover md:group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Overlay opacity adjusted */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-80 md:opacity-60 md:group-hover:opacity-80 transition-opacity duration-300" />
                </div>

                {/* Content */}
                {/* CHANGE: p-3 for mobile (less padding), p-6 for PC */}
                <div className="absolute bottom-0 left-0 w-full p-3 md:p-6 md:translate-y-2 md:group-hover:translate-y-0 transition-transform duration-300">
                  {/* Category: Tiny text on mobile */}
                  <div className="text-blue-400 text-[9px] md:text-xs font-bold uppercase tracking-widest mb-1 md:mb-2 truncate">
                    {project.category}
                  </div>
                  
                  {/* Title: Smaller text on mobile */}
                  <h3 className="text-sm md:text-2xl font-bold text-white mb-1 md:mb-2 leading-tight line-clamp-1 md:line-clamp-none">{project.title}</h3>
                  
                  {/* Tech Stack Tags: Smaller and limited on mobile to fit */}
                  <div className="flex flex-wrap gap-1 md:gap-2 mb-2 md:mb-4 h-5 md:h-auto overflow-hidden">
                    {project.tech.map((t, i) => (
                        <span key={i} className="text-[8px] md:text-[10px] bg-white/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded text-gray-300 whitespace-nowrap">
                            {t}
                        </span>
                    ))}
                  </div>

                  {/* View Project Link: Adjusted size */}
                  <div className="flex gap-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 md:delay-100">
                    <a href={project.link} target="_blank" className="flex items-center gap-1 text-[10px] md:text-sm font-medium text-white hover:text-blue-400 transition-colors">
                        View <span className="hidden md:inline">Project</span> <ExternalLink size={12} className="md:w-4 md:h-4" />
                    </a>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All Button */}
        <div className="mt-8 md:mt-16 flex justify-center">
            <Link href="/projects">
                <button className="px-6 py-2 md:px-8 md:py-3 text-sm md:text-base border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all">
                    View All Projects
                </button>
            </Link>
        </div>

      </div>
    </section>
  );
};

export default Portfolio;