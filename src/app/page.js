import Hero from "@/sections/Hero";
import Services from "@/sections/Services"; // Services section update karna padega agar dynamic hai
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
import { getProjects, getBlogs, getReviews, getPricing } from "@/lib/data";

// Specific Professional Metadata
export const metadata = {
  title: "DevSamp | Top Web Development & UI/UX Design Agency",
  description: "DevSamp is a premium digital agency providing custom Web Development, App Solutions, and UI/UX Design.",
  alternates: {
    canonical: 'https://devsamp.online',
  },
};

// Async Component (Server Side)
export default async function Home() {
  // Data Fetching directly on Server (Super Fast)
  const projects = await getProjects();
  const blogs = await getBlogs();
  const reviews = await getReviews();
  const pricingPlans = await getPricing();

  return (
    <main className="flex min-h-screen flex-col bg-black">
      <Hero />
      <Services /> {/* Agar services static hain to aise hi rahne dein */}
      <About />
      <Team />
      <Process />
      {/* Data passed as props */}
      <Portfolio initialProjects={projects} />
      <Pricing initialPlans={pricingPlans} />
      <Blogs initialBlogs={blogs} />
      <FAQ /> 
      <Testimonials initialReviews={reviews} />
      <Contact />
      <Footer />
    </main>
  );
}