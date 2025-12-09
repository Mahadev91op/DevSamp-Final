import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Yahan humne saare domains add kar diye hain
    domains: [
      "res.cloudinary.com", 
      "images.unsplash.com", 
      "randomuser.me"
    ], 
  },
};

export default withPWA(nextConfig);