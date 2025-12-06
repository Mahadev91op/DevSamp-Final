"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Linkedin, Twitter, Github, Plus } from "lucide-react";

const teamMembers = [
  {
    id: 1,
    name: "Vikram Das",
    role: "Founder & Tech Lead",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
    desc: "Expert in Next.js Architecture and Scalable Systems.",
  },
  {
    id: 2,
    name: "Sanya Kapoor",
    role: "Head of Design",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
    desc: "Award-winning UI/UX designer with a passion for minimalism.",
  },
  {
    id: 3,
    name: "Arjun Verma",
    role: "Senior Full Stack",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop",
    desc: "Master of Backend APIs and Database optimization.",
  },
  {
    id: 4,
    name: "Priya Sharma",
    role: "Marketing Lead",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
    desc: "Driving growth through data-driven SEO strategies.",
  }
];

const Team = () => {
  const [activeId, setActiveId] = useState(1); // Default pehla wala open rahega

  return (
    <section className="py-24 bg-black text-white overflow-hidden">
      
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The <span className="text-blue-500">Squad</span>
          </h2>
          <p className="text-gray-400">Meet the people who make the magic happen.</p>
        </div>

        {/* --- EXPANDABLE CARD CONTAINER --- */}
        <div className="flex flex-col md:flex-row gap-4 h-[600px] md:h-[500px] w-full">
          
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              layout // Smooth width animation
              onClick={() => setActiveId(member.id)}
              onHoverStart={() => setActiveId(member.id)} // Hover par expand hoga
              className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out border border-white/10 ${
                activeId === member.id 
                  ? "flex-[3] grayscale-0" // Active: 3 Guna Chouda + Color
                  : "flex-[1] grayscale hover:grayscale-0" // Inactive: Patla + B&W
              }`}
            >
              
              {/* Image Background */}
              <Image 
                src={member.image} 
                alt={member.name} 
                fill 
                className="object-cover"
              />
              
              {/* Dark Overlay (Inactive cards darker) */}
              <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
                activeId === member.id ? "opacity-0" : "opacity-60"
              }`}></div>

              {/* --- CONTENT (Sirf Active Card me dikhega) --- */}
              {activeId === member.id ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent"
                >
                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-1">{member.name}</h3>
                            <p className="text-blue-400 font-medium mb-3">{member.role}</p>
                            <p className="text-gray-300 text-sm max-w-xs">{member.desc}</p>
                        </div>
                        
                        {/* Social Buttons */}
                        <div className="flex gap-3">
                            <button className="p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-black transition-all">
                                <Linkedin size={20} />
                            </button>
                            <button className="p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-black transition-all">
                                <Twitter size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
              ) : (
                /* --- VERTICAL TEXT (Jab card band ho) --- */
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:rotate-[-90deg] whitespace-nowrap">
                    <p className="text-xl font-bold tracking-widest text-white/80 uppercase">{member.name}</p>
                </div>
              )}

              {/* Indicator Icon (Plus sign when inactive) */}
              {activeId !== member.id && (
                <div className="absolute top-6 right-6 md:top-auto md:bottom-6 md:left-1/2 md:-translate-x-1/2 p-2 rounded-full bg-white/10 backdrop-blur-md">
                    <Plus className="text-white" size={20} />
                </div>
              )}

            </motion.div>
          ))}
          
        </div>

      </div>
    </section>
  );
};

export default Team;