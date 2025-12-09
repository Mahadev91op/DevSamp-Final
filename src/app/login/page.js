"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Lock, Mail, User, ArrowRight, Loader2, Github, Globe, AlertCircle, ChevronLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  
  // States: 'login' | 'signup' | 'forgot'
  const [authMode, setAuthMode] = useState("login"); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  // --- FORM SUBMIT HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);
    
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            action: authMode, // login, signup, या forgot
            ...form 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (authMode === 'forgot') {
            setSuccessMsg(data.message);
            setLoading(false);
            return; // Redirect न करें, बस मैसेज दिखाएं
        }

        // Login/Signup Success
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("storage")); // Navbar update
        router.push("/dashboard");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (error) {
      setError("Network Error. Please try again.");
    }
    setLoading(false);
  };

  // --- SOCIAL LOGIN HANDLER (Mock/Simulation) ---
  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setError("");
    
    // सिमुलेशन के लिए हम एक डेमो यूजर बना रहे हैं
    const mockUser = {
        name: provider === 'google' ? 'Google User' : 'GitHub Dev',
        email: provider === 'google' ? 'user@gmail.com' : 'dev@github.com',
        provider: provider
    };

    try {
        // बैकएंड को सोशल लॉगिन की सूचना दें (ताकि DB में सेव हो सके)
        const res = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                action: 'social',
                ...mockUser
            }),
        });
        
        const data = await res.json();
        
        if(res.ok) {
            localStorage.setItem("user", JSON.stringify(data.user));
            window.dispatchEvent(new Event("storage"));
            
            // थोड़ा सा delay ताकि लोडर दिखे (Real feel)
            setTimeout(() => {
                router.push("/dashboard");
            }, 1000);
        } else {
            setError("Social login failed.");
            setLoading(false);
        }
    } catch (err) {
        setError("Connection failed.");
        setLoading(false);
    }
  };

  return (
    <main className="bg-black min-h-screen text-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6 pt-32 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-[#0a0a0a]/80 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative z-10"
        >
            <div className="text-center mb-8">
                <motion.h1 
                    key={authMode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-4xl font-bold mb-2"
                >
                    {authMode === 'login' && "Welcome Back"}
                    {authMode === 'signup' && "Join DevSamp"}
                    {authMode === 'forgot' && "Reset Password"}
                </motion.h1>
                <p className="text-gray-400 text-sm">
                    {authMode === 'login' && "Enter your details to access your dashboard"}
                    {authMode === 'signup' && "Create an account to start your journey"}
                    {authMode === 'forgot' && "Enter your email to receive a reset link"}
                </p>
            </div>

            {/* Error / Success Messages */}
            <AnimatePresence>
                {error && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2 overflow-hidden">
                        <AlertCircle size={16} className="shrink-0" /> {error}
                    </motion.div>
                )}
                {successMsg && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-6 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2 overflow-hidden">
                        <AlertCircle size={16} className="shrink-0" /> {successMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name Field (Only for Signup) */}
                <AnimatePresence mode="popLayout">
                    {authMode === 'signup' && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-1 overflow-hidden"
                        >
                            <label className="text-xs text-gray-500 font-bold ml-1 uppercase tracking-wider">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input type="text" placeholder="John Doe" className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-blue-500 transition-all text-sm text-white placeholder:text-gray-700" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required={authMode === 'signup'} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Email Field (Always Visible) */}
                <div className="space-y-1">
                    <label className="text-xs text-gray-500 font-bold ml-1 uppercase tracking-wider">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input type="email" placeholder="name@company.com" className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-blue-500 transition-all text-sm text-white placeholder:text-gray-700" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                    </div>
                </div>

                {/* Password Field (Hidden in Forgot Mode) */}
                <AnimatePresence mode="popLayout">
                    {authMode !== 'forgot' && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-1 overflow-hidden"
                        >
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Password</label>
                                {authMode === 'login' && (
                                    <button type="button" onClick={() => setAuthMode('forgot')} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot Password?</button>
                                )}
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input type="password" placeholder="••••••••" className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-blue-500 transition-all text-sm text-white placeholder:text-gray-700" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={authMode !== 'forgot'} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed group">
                    {loading ? <Loader2 className="animate-spin" /> : (
                        authMode === 'login' ? "Sign In" : 
                        authMode === 'signup' ? "Create Account" : "Send Reset Link"
                    )} 
                    {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>}
                </button>
            </form>

            {/* Back Button for Forgot Password */}
            {authMode === 'forgot' && (
                <div className="mt-6 text-center">
                    <button onClick={() => setAuthMode('login')} className="text-sm text-gray-400 hover:text-white flex items-center justify-center gap-1 mx-auto transition-colors">
                        <ChevronLeft size={16}/> Back to Login
                    </button>
                </div>
            )}

            {/* Social Login (Only show in Login/Signup) */}
            {authMode !== 'forgot' && (
                <>
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0a0a0a] px-2 text-gray-500 font-bold">Or continue with</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => handleSocialLogin('github')} className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 py-2.5 rounded-xl transition-all text-sm font-medium text-gray-300 hover:text-white">
                            <Github size={18} /> GitHub
                        </button>
                        <button onClick={() => handleSocialLogin('google')} className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 py-2.5 rounded-xl transition-all text-sm font-medium text-gray-300 hover:text-white">
                            <Globe size={18} /> Google
                        </button>
                    </div>

                    <div className="mt-8 text-center text-sm text-gray-400">
                        {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <button 
                            onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setError(""); }} 
                            className="text-blue-400 font-bold hover:text-blue-300 hover:underline transition-colors"
                        >
                            {authMode === 'login' ? "Sign Up" : "Login"}
                        </button>
                    </div>
                </>
            )}
        </motion.div>
      </div>
    </main>
  );
}