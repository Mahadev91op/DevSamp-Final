import Hero from "@/sections/Hero";
import Services from "@/sections/Services";
import About from "@/sections/About";
import Team from "@/sections/Team";
import Process from "@/sections/Process";
import Pricing from "@/sections/Pricing";
import FAQ from "@/sections/FAQ"; 
import Portfolio from "@/sections/Portfolio";
import Testimonials from "@/sections/Testimonials";
import Contact from "@/sections/Contact";
import Footer from "@/components/Footer";
import Blogs from "@/sections/Blogs";

// Specific Metadata for Homepage
export const metadata = {
  title: "DevSamp | Transform Ideas into Digital Reality",
  description: "DevSamp offers top-tier web development, app creation, and UI/UX design services. Hire expert developers for your next big project.",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black">
      <Hero />
      <Services />
      <About />
      <Team />
      <Process />
      <Portfolio />
      <Pricing />
      <Blogs />
      <FAQ /> 
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}