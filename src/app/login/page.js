"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Lock, Mail, User, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login/Signup
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            action: isLogin ? "login" : "signup",
            ...form 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Simple Storage Auth (For Demo)
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <main className="bg-black min-h-screen text-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6 pt-32 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative z-10"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h1>
                <p className="text-gray-400 text-sm">Access your project dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-bold ml-1 uppercase">Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input type="text" placeholder="John Doe" className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-blue-500 transition-all text-sm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                        </div>
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs text-gray-500 font-bold ml-1 uppercase">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input type="email" placeholder="name@example.com" className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-blue-500 transition-all text-sm" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs text-gray-500 font-bold ml-1 uppercase">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input type="password" placeholder="••••••••" className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-blue-500 transition-all text-sm" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                    </div>
                </div>

                <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-4">
                    {loading ? <Loader2 className="animate-spin" /> : (isLogin ? "Sign In" : "Sign Up")} <ArrowRight size={18} />
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => setIsLogin(!isLogin)} className="text-blue-400 font-bold hover:underline">
                    {isLogin ? "Sign Up" : "Login"}
                </button>
            </div>
        </motion.div>
      </div>
    </main>
  );
}