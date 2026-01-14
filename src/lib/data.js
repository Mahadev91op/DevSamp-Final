import connectDB from "@/lib/db";
import Project from "@/models/Project";
import Blog from "@/models/Blog";
import Review from "@/models/Review";
import Pricing from "@/models/Pricing";
import Service from "@/models/Service";

export async function getProjects() {
  try {
    await connectDB();
    const projects = await Project.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(projects));
  } catch (error) {
    return [];
  }
}

export async function getBlogs() {
  try {
    await connectDB();
    const blogs = await Blog.find().sort({ createdAt: -1 }).limit(3).lean();
    return JSON.parse(JSON.stringify(blogs));
  } catch (error) {
    return [];
  }
}

export async function getReviews() {
  try {
    await connectDB();
    
    // FIX: 'approved: true' hata diya gaya hai taaki saare reviews dikhen
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    
    return JSON.parse(JSON.stringify(reviews));
  } catch (error) {
    return [];
  }
}

export async function getPricing() {
  try {
    await connectDB();
    const plans = await Pricing.find().sort({ priceMonthly: 1 }).lean();
    return JSON.parse(JSON.stringify(plans));
  } catch (error) {
    return [];
  }
}

export async function getServices() {
  try {
    await connectDB();
    const services = await Service.find().sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(services));
  } catch (error) {
    return [];
  }
}