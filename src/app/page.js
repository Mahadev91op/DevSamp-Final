import Hero from "@/sections/Hero";
import Services from "@/sections/Services";
import About from "@/sections/About";
import Team from "@/sections/Team";
import Process from "@/sections/Process";
import Pricing from "@/sections/Pricing";
import FAQ from "@/sections/FAQ"; // <-- Import kiya
import Portfolio from "@/sections/Portfolio";
import Testimonials from "@/sections/Testimonials";
import Contact from "@/sections/Contact";
import Footer from "@/components/Footer";

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
      <FAQ /> {/* <-- Yahan Add kiya */}
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}