"use client";

import { motion } from "framer-motion";
import { 
  Monitor, 
  Smartphone, 
  Palette, 
  Globe, 
  Search, 
  Server 
} from "lucide-react";

const services = [
  {
    title: "Web Development",
    desc: "Blazing fast websites using Next.js, React, and Tailwind CSS tailored for performance.",
    icon: <Monitor size={32} />,
    color: "text-blue-500",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "App Development",
    desc: "Cross-platform mobile apps that work seamlessly on iOS and Android using React Native.",
    icon: <Smartphone size={32} />,
    color: "text-purple-500",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "UI/UX Design",
    desc: "Modern, intuitive, and user-centric designs that drive engagement and retention.",
    icon: <Palette size={32} />,
    color: "text-pink-500",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    title: "SEO & Marketing",
    desc: "Rank higher on Google with our technical SEO and content marketing strategies.",
    icon: <Search size={32} />,
    color: "text-green-500",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    title: "E-Commerce",
    desc: "Scalable online stores built with Shopify or custom solutions to boost your sales.",
    icon: <Globe size={32} />,
    color: "text-orange-500",
    gradient: "from-orange-500 to-yellow-500"
  },
  {
    title: "Backend & Cloud",
    desc: "Secure and scalable server-side solutions using Node.js, AWS, and modern databases.",
    icon: <Server size={32} />,
    color: "text-indigo-500",
    gradient: "from-indigo-500 to-violet-500"
  },
];

const Services = () => {
  return (
    <section id="services" className="relative w-full py-24 bg-black text-white">
      
      {/* Background Glow for Ambiance */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[10%] left-0 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Our <span className="text-blue-500">Services</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 max-w-xl mx-auto text-lg"
          >
            We provide comprehensive digital solutions to help your business grow and stand out.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative p-1 rounded-2xl bg-white/5 hover:bg-transparent transition-all duration-300"
            >
              {/* Hover Gradient Border Effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 -z-10`} />
              
              {/* Card Content */}
              <div className="h-full bg-neutral-900/90 backdrop-blur-xl border border-white/10 p-8 rounded-xl group-hover:border-transparent transition-colors relative overflow-hidden">
                
                {/* Decorative Circle behind Icon */}
                <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${service.gradient} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out`}></div>

                {/* Icon */}
                <div className={`mb-6 p-3 w-fit rounded-lg bg-white/5 border border-white/10 ${service.color} group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>

                {/* Text */}
                <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300">
                  {service.desc}
                </p>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;