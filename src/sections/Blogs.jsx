"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, Youtube, Instagram, ExternalLink } from "lucide-react";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        setBlogs(data.blogs?.slice(0, 3) || []);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      }
    };
    fetchBlogs();
  }, []);

  if (blogs.length === 0) return null;

  return (
    // CHANGE: py-12 for mobile, py-24 for PC
    <section id="blog" className="py-12 md:py-24 bg-black text-white relative">
      {/* CHANGE: px-4 for mobile, px-6 for PC */}
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        {/* CHANGE: mb-6 for mobile, items-start for mobile alignment */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-12 gap-4 md:gap-6">
          <div>
            {/* CHANGE: Text sizes for mobile */}
            <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} className="text-3xl md:text-5xl font-bold text-white mb-1 md:mb-2">
              Latest <span className="text-blue-500">Updates</span>
            </motion.h2>
            <p className="text-gray-400 text-sm md:text-base">Content straight from our social channels.</p>
          </div>
          <Link href="/blog">
            {/* CHANGE: Smaller button on mobile */}
            <button className="px-5 py-1.5 md:px-6 md:py-2 border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all text-xs md:text-sm font-bold flex items-center gap-2">
                View All <ArrowRight size={14} className="md:w-4 md:h-4" />
            </button>
          </Link>
        </div>

        {/* Blogs Container */}
        {/* CHANGE: 
            - Flex layout for mobile (horizontal scroll) 
            - Grid layout for PC
            - 'snap-x' and 'scrollbar-hide' for app-like feel
            - '-mx-4 px-4' allows scrolling to hit screen edges
        */}
        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-6 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {blogs.map((blog, index) => (
            <motion.a
                href={blog.link}
                target="_blank"
                rel="noopener noreferrer"
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                // CHANGE: 
                // - w-[80vw] for mobile (card width)
                // - rounded-xl for mobile
                // - flex-shrink-0 prevents shrinking in flex container
                className="group flex-shrink-0 w-[80vw] md:w-auto snap-center bg-[#0a0a0a] border border-white/10 rounded-xl md:rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all flex flex-col h-full"
            >
                {/* Image Container */}
                {/* CHANGE: h-40 for mobile, h-52 for PC */}
                <div className="h-40 md:h-52 w-full relative overflow-hidden bg-gray-900">
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    
                    {/* Overlay Icon */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {blog.platform === 'youtube' ? <Youtube size={48} className="text-red-500 fill-current scale-75 md:scale-100" /> : <Instagram size={48} className="text-pink-500 scale-75 md:scale-100" />}
                    </div>

                    {/* Badge */}
                    <div className={`absolute top-3 left-3 md:top-4 md:left-4 text-white text-[9px] md:text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${blog.platform === 'youtube' ? 'bg-red-600' : 'bg-pink-600'}`}>
                        {blog.platform === 'youtube' ? 'Video' : 'Post'}
                    </div>
                </div>

                {/* Content */}
                {/* CHANGE: p-4 for mobile, p-6 for PC */}
                <div className="p-4 md:p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-500 mb-2 md:mb-3">
                        <Calendar size={10} className="md:w-3 md:h-3" />
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    {/* CHANGE: text-lg for mobile */}
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {blog.title}
                    </h3>
                    {/* CHANGE: text-xs for mobile */}
                    <p className="text-gray-400 text-xs md:text-sm line-clamp-2 mb-3 md:mb-4 flex-grow">
                        {blog.desc}
                    </p>
                    <div className="text-xs md:text-sm font-bold text-white flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                        {blog.platform === 'youtube' ? 'Watch Video' : 'View Post'} <ExternalLink size={12} className="text-blue-500 md:w-[14px] md:h-[14px]"/>
                    </div>
                </div>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Blogs;