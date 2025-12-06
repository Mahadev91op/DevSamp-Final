"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation"; // 1. Pathname hook import

const CustomCursor = () => {
  const pathname = usePathname(); // 2. Current path get karein
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
      if (hoveredElement) {
        const style = window.getComputedStyle(hoveredElement);
        const isClickable = 
            style.cursor === 'pointer' || 
            hoveredElement.tagName === 'A' || 
            hoveredElement.tagName === 'BUTTON';
        setIsHovering(isClickable);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  // 3. Admin Check: Agar admin panel hai to NULL return karein
  // Isse custom "dot" cursor hat jayega
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <motion.div
        className="hidden lg:block fixed top-0 left-0 w-4 h-4 bg-white rounded-full mix-blend-difference pointer-events-none z-[9999]"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isHovering ? 2.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      
      <motion.div
        className="hidden lg:block fixed top-0 left-0 w-8 h-8 border border-white/30 rounded-full pointer-events-none z-[9998]"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      />
    </>
  );
};

export default CustomCursor;