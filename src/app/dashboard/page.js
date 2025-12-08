"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, Home, FolderOpen, User, Settings, FileText, 
  CheckCircle2, Clock, AlertCircle, ChevronRight, 
  ExternalLink, Download, CreditCard, Layout, Code2, Rocket
} from "lucide-react";

// --- MOCK DATA (Backend se replace karein) ---
const PROJECT_STAGES = [
  { id: 1, title: "Discovery", status: "completed", date: "Oct 10" },
  { id: 2, title: "UI/UX Design", status: "completed", date: "Oct 24" },
  { id: 3, title: "Development", status: "in-progress", date: "In Progress" },
  { id: 4, title: "Testing", status: "pending", date: "Est. Nov 15" },
  { id: 5, title: "Deployment", status: "pending", date: "Est. Nov 20" },
];

const RECENT_UPDATES = [
  { id: 1, title: "Homepage Layout Approved", desc: "Client approved the Figma design for the homepage.", date: "2 days ago", type: "success" },
  { id: 2, title: "Database Schema Created", desc: "MongoDB models setup complete.", date: "3 days ago", type: "info" },
  { id: 3, title: "Initial Meeting", desc: "Project requirements gathered.", date: "1 week ago", type: "neutral" },
];

const INVOICES = [
  { id: "INV-001", date: "Oct 01, 2023", amount: "$1,500", status: "Paid" },
  { id: "INV-002", date: "Nov 01, 2023", amount: "$1,500", status: "Pending" },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // overview, project, billing, settings

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white flex pt-28">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 border-r border-white/10 hidden md:flex flex-col fixed left-0 top-28 bottom-0 bg-black z-10 overflow-y-auto">
        <div className="p-6 flex-1 space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-4">Main Menu</p>
            <NavItem icon={Home} label="Overview" id="overview" active={activeTab} set={setActiveTab} />
            <NavItem icon={FolderOpen} label="My Project" id="project" active={activeTab} set={setActiveTab} />
            <NavItem icon={FileText} label="Billing & Invoices" id="billing" active={activeTab} set={setActiveTab} />
            <NavItem icon={Settings} label="Settings" id="settings" active={activeTab} set={setActiveTab} />
        </div>
        
        <div className="p-6 border-t border-white/10">
            <div className="flex items-center gap-3 mb-6 px-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors w-full px-4 py-3 rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20">
                <LogOut size={18}/> Logout
            </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-6 md:p-10 md:ml-64 w-full max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {activeTab === 'overview' && `Welcome back, ${user.name.split(' ')[0]} 👋`}
                {activeTab === 'project' && "Project Dashboard"}
                {activeTab === 'billing' && "Billing & Invoices"}
                {activeTab === 'settings' && "Account Settings"}
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
                {activeTab === 'overview' && "Here's what's happening with your projects today."}
                {activeTab === 'project' && "Track progress, updates, and deliverables."}
                {activeTab === 'billing' && "Manage your payments and download invoices."}
                {activeTab === 'settings' && "Update your profile and preferences."}
            </p>
        </header>

        {/* TABS CONTENT */}
        <div className="space-y-8 animate-fade-in">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard 
                            label="Active Projects" 
                            value="1" 
                            icon={<FolderOpen className="text-blue-500" size={24}/>} 
                            sub="On Track"
                        />
                        <StatCard 
                            label="Next Milestone" 
                            value="Development" 
                            icon={<Code2 className="text-purple-500" size={24}/>} 
                            sub="Due in 5 days"
                        />
                        <StatCard 
                            label="Pending Payment" 
                            value="$1,500" 
                            icon={<Clock className="text-yellow-500" size={24}/>} 
                            sub="Invoice #002"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Project Snapshot */}
                        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Current Project</h3>
                                <button onClick={() => setActiveTab('project')} className="text-blue-400 text-sm hover:underline">View Details</button>
                            </div>
                            
                            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 mb-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                                        <Layout size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">E-Commerce Web App</h4>
                                        <p className="text-xs text-gray-400">Custom Next.js Solution</p>
                                    </div>
                                    <span className="ml-auto px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/20">Active</span>
                                </div>
                                
                                {/* Mini Progress Bar */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-gray-400">
                                        <span>Progress</span>
                                        <span>60%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-[60%] rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl flex flex-col">
                            <h3 className="text-xl font-bold mb-6">Recent Updates</h3>
                            <div className="space-y-6 overflow-y-auto max-h-[250px] custom-scrollbar pr-2">
                                {RECENT_UPDATES.map((update) => (
                                    <div key={update.id} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-3 h-3 rounded-full ${update.type === 'success' ? 'bg-green-500' : update.type === 'info' ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                                            <div className="w-[1px] h-full bg-white/10 my-1"></div>
                                        </div>
                                        <div className="pb-2">
                                            <h4 className="text-sm font-bold text-white">{update.title}</h4>
                                            <p className="text-xs text-gray-400 mt-1 mb-1">{update.desc}</p>
                                            <span className="text-[10px] text-gray-600">{update.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* 2. PROJECT TAB (Advanced Tracking) */}
            {activeTab === 'project' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left: Main Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Timeline / Stepper */}
                        <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl">
                            <h3 className="text-xl font-bold mb-8">Project Timeline</h3>
                            <div className="space-y-0">
                                {PROJECT_STAGES.map((stage, index) => (
                                    <div key={stage.id} className="flex group">
                                        {/* Icon & Line */}
                                        <div className="flex flex-col items-center mr-6">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-all ${
                                                stage.status === 'completed' ? 'bg-green-500 border-green-500 text-black' :
                                                stage.status === 'in-progress' ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' :
                                                'bg-[#0a0a0a] border-white/20 text-gray-500'
                                            }`}>
                                                {stage.status === 'completed' ? <CheckCircle2 size={20}/> : 
                                                 stage.status === 'in-progress' ? <Clock size={20} className="animate-pulse"/> : 
                                                 <span className="text-sm font-bold">{index + 1}</span>}
                                            </div>
                                            {index !== PROJECT_STAGES.length - 1 && (
                                                <div className={`w-1 h-12 md:h-16 ${
                                                    stage.status === 'completed' ? 'bg-green-500' : 'bg-white/10'
                                                }`}></div>
                                            )}
                                        </div>
                                        
                                        {/* Content */}
                                        <div className={`pb-8 ${stage.status === 'in-progress' ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'} transition-opacity`}>
                                            <h4 className={`text-lg font-bold ${stage.status === 'completed' ? 'text-green-400' : stage.status === 'in-progress' ? 'text-blue-400' : 'text-gray-400'}`}>
                                                {stage.title}
                                            </h4>
                                            <p className="text-sm text-gray-500 mt-1">{stage.date}</p>
                                            {stage.status === 'in-progress' && (
                                                <div className="mt-3 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-300 inline-block">
                                                    Currently working on backend integration.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Quick Links & Assets */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 p-6 rounded-3xl">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Rocket className="text-purple-400" size={20}/> Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-4 bg-black/40 hover:bg-blue-600 border border-white/10 hover:border-blue-500 rounded-xl transition-all group">
                                    <span className="text-sm font-bold">View Live Staging</span>
                                    <ExternalLink size={16} className="text-gray-400 group-hover:text-white"/>
                                </button>
                                <button className="w-full flex items-center justify-between p-4 bg-black/40 hover:bg-[#F24E1E] border border-white/10 hover:border-[#F24E1E] rounded-xl transition-all group">
                                    <span className="text-sm font-bold">Figma Design</span>
                                    <ExternalLink size={16} className="text-gray-400 group-hover:text-white"/>
                                </button>
                                <button className="w-full flex items-center justify-between p-4 bg-black/40 hover:bg-gray-800 border border-white/10 hover:border-white/30 rounded-xl transition-all group">
                                    <span className="text-sm font-bold">Github Repo</span>
                                    <Code2 size={16} className="text-gray-400 group-hover:text-white"/>
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl">
                            <h3 className="text-lg font-bold mb-4">Project Files</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                                    <div className="p-2 bg-red-500/20 rounded-lg text-red-400"><FileText size={18}/></div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-bold truncate">Contract.pdf</p>
                                        <p className="text-xs text-gray-500">2.4 MB</p>
                                    </div>
                                    <Download size={16} className="text-gray-400"/>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><FileText size={18}/></div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-bold truncate">Requirements.docx</p>
                                        <p className="text-xs text-gray-500">1.1 MB</p>
                                    </div>
                                    <Download size={16} className="text-gray-400"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. BILLING TAB */}
            {activeTab === 'billing' && (
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden">
                    <div className="p-6 md:p-8 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h3 className="text-xl font-bold">Payment History</h3>
                            <p className="text-sm text-gray-400">Track all your invoices and payments.</p>
                        </div>
                        <button className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
                            <CreditCard size={16}/> Add Payment Method
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                                <tr>
                                    <th className="p-6">Invoice ID</th>
                                    <th className="p-6">Date</th>
                                    <th className="p-6">Amount</th>
                                    <th className="p-6">Status</th>
                                    <th className="p-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {INVOICES.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-6 font-bold text-white">{inv.id}</td>
                                        <td className="p-6 text-gray-400">{inv.date}</td>
                                        <td className="p-6 font-mono text-white">{inv.amount}</td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                                inv.status === 'Paid' 
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                                    : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                            }`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <button className="text-blue-400 hover:text-white text-xs font-bold flex items-center gap-1 justify-end ml-auto group">
                                                Download PDF <Download size={14} className="group-hover:translate-y-0.5 transition-transform"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 4. SETTINGS TAB */}
            {activeTab === 'settings' && (
                <div className="max-w-2xl bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl">
                    <h3 className="text-xl font-bold mb-6">Profile Details</h3>
                    <form className="space-y-6">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold text-gray-400">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <button type="button" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all">Change Avatar</button>
                                <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. Max size 800K</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 font-bold uppercase ml-1">Full Name</label>
                                <input type="text" defaultValue={user.name} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all"/>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 font-bold uppercase ml-1">Email Address</label>
                                <input type="email" defaultValue={user.email} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all" disabled/>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 font-bold uppercase ml-1">New Password</label>
                            <input type="password" placeholder="Leave blank to keep current" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all"/>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex justify-end">
                            <button className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </div>
      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---
const NavItem = ({ icon: Icon, label, id, active, set }) => (
    <button 
        onClick={() => set(id)} 
        className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-300 group ${
            active === id 
                ? "bg-white text-black font-bold shadow-lg shadow-white/5" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
    >
        <Icon size={20} className={active === id ? "text-black" : "text-gray-500 group-hover:text-white"} /> 
        {label}
        {active === id && <ChevronRight size={16} className="ml-auto opacity-50"/>}
    </button>
);

const StatCard = ({ label, value, icon, sub }) => (
    <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl hover:border-white/20 transition-all cursor-default">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/5 rounded-2xl">{icon}</div>
            <span className="text-xs font-bold bg-white/5 px-2 py-1 rounded text-gray-400">{sub}</span>
        </div>
        <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{label}</p>
    </div>
);