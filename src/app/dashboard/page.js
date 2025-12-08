"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LogOut, Home, FolderOpen, User, Settings, FileText, 
  CheckCircle2, Clock, AlertCircle, ChevronRight, 
  ExternalLink, Download, CreditCard, Layout, Code2, Rocket, Loader2, DollarSign, Link as LinkIcon
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); 
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    } else {
      const u = JSON.parse(storedUser);
      setUser(u);
      // API call to fetch this specific user's project
      fetch(`/api/client-projects?email=${u.email}`)
        .then(res => res.json())
        .then(data => {
            setProjectData(data.projects);
            setLoading(false);
        })
        .catch(err => setLoading(false));
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
      
      {/* SIDEBAR - ORIGINAL DESIGN */}
      <aside className="w-64 border-r border-white/10 hidden md:flex flex-col fixed left-0 top-28 bottom-0 bg-black z-10 overflow-y-auto">
        <div className="p-6 flex-1 space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-4">Main Menu</p>
            <NavItem icon={Home} label="Overview" id="overview" active={activeTab} set={setActiveTab} />
            <NavItem icon={FolderOpen} label="My Project" id="project" active={activeTab} set={setActiveTab} />
            <NavItem icon={FileText} label="Resources" id="resources" active={activeTab} set={setActiveTab} />
            <NavItem icon={Settings} label="Settings" id="settings" active={activeTab} set={setActiveTab} />
        </div>
        <div className="p-6 border-t border-white/10">
            <div className="flex items-center gap-3 mb-6 px-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg">{user.name.charAt(0).toUpperCase()}</div>
                <div className="overflow-hidden"><p className="text-sm font-bold truncate text-white">{user.name}</p><p className="text-xs text-gray-500 truncate">{user.email}</p></div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors w-full px-4 py-3 rounded-xl hover:bg-red-500/10"><LogOut size={18}/> Logout</button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 md:ml-64 w-full max-w-7xl mx-auto">
        <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {activeTab === 'overview' && `Welcome back, ${user.name.split(' ')[0]} 👋`}
                {activeTab === 'project' && "Project Dashboard"}
                {activeTab === 'resources' && "Project Assets"}
                {activeTab === 'settings' && "Account Settings"}
            </h1>
            <p className="text-gray-400 text-sm md:text-base">Track progress, updates, and deliverables.</p>
        </header>

        <div className="space-y-8 animate-fade-in">
            {loading ? (
                <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={32}/></div>
            ) : !projectData ? (
                <div className="p-10 border border-white/10 rounded-3xl bg-[#0a0a0a] text-center">
                    <h3 className="text-xl font-bold mb-2">No Active Project</h3>
                    <p className="text-gray-400">Contact admin to link your project.</p>
                </div>
            ) : (
                <>
                    {/* OVERVIEW TAB - Enhanced with Payment & Info */}
                    {activeTab === 'overview' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <StatCard label="Status" value={projectData.status} icon={<FolderOpen className="text-blue-500" size={24}/>} sub="Current State"/>
                                <StatCard label="Payment" value={projectData.paymentStatus} icon={<DollarSign className={projectData.paymentStatus === 'Paid' ? "text-green-500" : "text-yellow-500"} size={24}/>} sub={projectData.budget || "TBD"}/>
                                <StatCard label="Next Milestone" value={projectData.nextMilestone} icon={<Code2 className="text-purple-500" size={24}/>} sub={`${projectData.progress}% Done`}/>
                                <StatCard label="Due Date" value={projectData.dueDate} icon={<Clock className="text-orange-500" size={24}/>} sub="Estimated"/>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Project Details Card */}
                                <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl">
                                    <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">Current Project</h3></div>
                                    
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><Layout size={24} /></div>
                                            <div>
                                                <h4 className="font-bold text-lg">{projectData.title}</h4>
                                                <p className="text-xs text-gray-400">DevSamp Agency</p>
                                            </div>
                                        </div>
                                        
                                        {/* Project Description (New) */}
                                        {projectData.description && (
                                            <div className="mb-6 text-sm text-gray-300 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5">
                                                {projectData.description}
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-gray-400"><span>Overall Progress</span><span>{projectData.progress}%</span></div>
                                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${projectData.progress}%` }}></div></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Updates & Quick Actions */}
                                <div className="space-y-6">
                                    {/* Recent Updates */}
                                    <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl flex flex-col max-h-[400px]">
                                        <h3 className="text-xl font-bold mb-6">Recent Updates</h3>
                                        <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2 flex-1">
                                            {projectData.updates && projectData.updates.map((u, i) => (
                                                <div key={i} className="flex gap-4">
                                                    <div className="flex flex-col items-center"><div className="w-3 h-3 rounded-full bg-blue-500"></div><div className="w-[1px] h-full bg-white/10 my-1"></div></div>
                                                    <div className="pb-2"><h4 className="text-sm font-bold text-white">{u.title}</h4><p className="text-xs text-gray-400 mt-1">{u.desc}</p><span className="text-[10px] text-gray-600">{u.date}</span></div>
                                                </div>
                                            ))}
                                            {(!projectData.updates || projectData.updates.length === 0) && <p className="text-gray-500 text-sm">No updates yet.</p>}
                                        </div>
                                    </div>

                                    {/* Quick Resources (New) */}
                                    {projectData.links && projectData.links.length > 0 && (
                                        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 p-6 rounded-3xl">
                                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><LinkIcon className="text-purple-400" size={20}/> Quick Links</h3>
                                            <div className="space-y-3">
                                                {projectData.links.map((link, i) => (
                                                    <a href={link.url} target="_blank" key={i} className="w-full flex items-center justify-between p-3 bg-black/40 hover:bg-blue-600/20 border border-white/10 rounded-xl transition-all group cursor-pointer text-sm font-bold text-gray-300 hover:text-white">
                                                        {link.title} <ExternalLink size={14}/>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* PROJECT TAB - Timeline */}
                    {activeTab === 'project' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl">
                                    <h3 className="text-xl font-bold mb-8">Detailed Timeline</h3>
                                    <div className="space-y-0">
                                        {projectData.stages.map((stage, index) => (
                                            <div key={stage.id} className="flex group">
                                                <div className="flex flex-col items-center mr-6">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-all ${stage.status === 'completed' || projectData.progress >= (index + 1) * 20 ? 'bg-green-500 border-green-500 text-black' : 'bg-[#0a0a0a] border-white/20 text-gray-500'}`}>
                                                        {stage.status === 'completed' || projectData.progress >= (index + 1) * 20 ? <CheckCircle2 size={20}/> : <span className="text-sm font-bold">{index + 1}</span>}
                                                    </div>
                                                    {index !== projectData.stages.length - 1 && <div className={`w-1 h-12 md:h-16 ${stage.status === 'completed' ? 'bg-green-500' : 'bg-white/10'}`}></div>}
                                                </div>
                                                <div className="pb-8 opacity-100">
                                                    <h4 className={`text-lg font-bold ${stage.status === 'completed' ? 'text-green-400' : 'text-gray-400'}`}>{stage.title}</h4>
                                                    <p className="text-sm text-gray-500 mt-1">{stage.status === 'completed' ? "Completed" : "Pending/In Progress"}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* RESOURCES TAB (New dedicated tab if lists are long) */}
                    {activeTab === 'resources' && (
                        <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl">
                            <h3 className="text-xl font-bold mb-6">Project Assets & Documents</h3>
                            {projectData.links && projectData.links.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {projectData.links.map((link, i) => (
                                        <a href={link.url} target="_blank" key={i} className="flex flex-col p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group">
                                            <div className="p-3 bg-blue-600/20 text-blue-400 w-fit rounded-xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors"><LinkIcon size={24}/></div>
                                            <h4 className="font-bold text-lg mb-1">{link.title}</h4>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">Open Resource <ExternalLink size={12}/></p>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No resources shared yet.</p>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
      </main>
    </div>
  );
}

const NavItem = ({ icon: Icon, label, id, active, set }) => (
    <button onClick={() => set(id)} className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-300 group ${active === id ? "bg-white text-black font-bold shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
        <Icon size={20} className={active === id ? "text-black" : "text-gray-500 group-hover:text-white"} /> {label} {active === id && <ChevronRight size={16} className="ml-auto opacity-50"/>}
    </button>
);

const StatCard = ({ label, value, icon, sub }) => (
    <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl hover:border-white/20 transition-all cursor-default">
        <div className="flex justify-between items-start mb-4"><div className="p-3 bg-white/5 rounded-2xl">{icon}</div><span className="text-xs font-bold bg-white/5 px-2 py-1 rounded text-gray-400">{sub}</span></div>
        <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{label}</p>
    </div>
);