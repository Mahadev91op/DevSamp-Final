"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  LayoutDashboard, Users, Layers, Plus, Loader2, LogOut, Menu, X, 
  Bell, CheckCircle, AlertCircle, Briefcase, PenBox, Calendar, 
  Trash2, Search, ExternalLink, CreditCard, Star, MessageCircle, 
  ArrowUpRight, Download, TrendingUp, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- CUSTOM SVG CHART COMPONENT ---
const AnalyticsChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data) || 1;
  const h = 100; // height
  const w = 300; // width
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (val / max) * h;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="w-full h-32 relative mt-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline fill="none" stroke="#3b82f6" strokeWidth="3" points={points} strokeLinecap="round" strokeLinejoin="round" />
        <polygon fill="url(#chartGradient)" points={`0,${h} ${points} ${w},${h}`} opacity="0.5" />
        {data.map((val, i) => (
           <circle key={i} cx={(i / (data.length - 1)) * w} cy={h - (val / max) * h} r="3" fill="#fff" stroke="#3b82f6" strokeWidth="2" />
        ))}
      </svg>
      <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-mono">
        <span>7 Days Ago</span>
        <span>Today</span>
      </div>
    </div>
  );
};

// --- LIGHTWEIGHT TOAST ---
const Toast = ({ message, type, onClose }) => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
    className={`fixed top-6 right-1/2 translate-x-1/2 md:translate-x-0 md:right-8 z-[100] flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl backdrop-blur-xl border ${
      type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
    }`}
  >
    {type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
    <span className="text-sm font-bold tracking-wide">{message}</span>
  </motion.div>
);

// --- STATS CARD ---
const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white/5 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-all hover:-translate-y-1 duration-300">
    <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${color}-500/20 blur-2xl rounded-full group-hover:bg-${color}-500/30 transition-all`}></div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400 border border-${color}-500/10`}>
        <Icon size={22} />
      </div>
      {trend && (
        <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1">
          <TrendingUp size={10} /> {trend}
        </span>
      )}
    </div>
    <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</h3>
    <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold">{title}</p>
  </div>
);

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard"); 
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); 
  const [searchTerm, setSearchTerm] = useState("");

  const [data, setData] = useState({ leads: [], services: [], team: [], projects: [], pricing: [], reviews: [] });
  const [forms, setForms] = useState({
    project: { id: null, title: "", category: "", image: "", tech: "", link: "" },
    service: { title: "", desc: "", icon: "Monitor", color: "text-blue-500", gradient: "from-blue-500 to-cyan-500" },
    team: { id: null, name: "", role: "", image: "", desc: "" },
    pricing: { id: null, name: "", desc: "", priceMonthly: "", priceYearly: "", features: "", missing: "", popular: false }
  });

  const showToast = (message, type = "success") => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

  const chartData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();
    return last7Days.map(date => data.leads.filter(l => l.createdAt?.startsWith(date)).length);
  }, [data.leads]);

  const filteredLeads = data.leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogin = (e) => { 
    e.preventDefault(); 
    if (password === "devsamp_boss_123") { setIsAuthenticated(true); fetchAllData(); } 
    else { showToast("Invalid Passkey", "error"); } 
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const endpoints = ["contact", "services", "team", "projects", "pricing", "reviews"];
      const responses = await Promise.all(endpoints.map(ep => fetch(`/api/${ep}`).then(res => res.json())));
      setData({
        leads: responses[0].contacts || [],
        services: responses[1].services || [],
        team: responses[2].team || [],
        projects: responses[3].projects || [],
        pricing: responses[4].pricing || [],
        reviews: responses[5].reviews || []
      });
    } catch (e) { showToast("Sync Failed", "error"); }
    setLoading(false);
  };

  const exportLeads = () => {
    const headers = "Name,Email,Service,Message,Date,Status\n";
    const rows = data.leads.map(l => `${l.name},${l.email},${l.service},"${l.message.replace(/"/g, '""')}",${new Date(l.createdAt).toLocaleDateString()},${l.status}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Leads_Export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast("Leads Exported Successfully!");
  };

  const handleDelete = async (api, id) => {
    if (!confirm("Permanently delete this item?")) return;
    try {
        await fetch(`/api/${api}?id=${id}`, { method: "DELETE" });
        showToast("Item Deleted");
        fetchAllData();
    } catch(e) { showToast("Delete Failed", "error"); }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
        await fetch("/api/contact", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
        const updatedLeads = data.leads.map(l => l._id === id ? { ...l, status } : l);
        setData(prev => ({...prev, leads: updatedLeads}));
        showToast("Status Updated");
    } catch(e) { showToast("Update Failed", "error"); }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    if(type === 'project') setForms(p => ({ ...p, project: item ? { ...item, id: item._id, tech: item.tech.join(', ') } : { id: null, title: "", category: "", image: "", tech: "", link: "" } }));
    if(type === 'service') setForms(p => ({ ...p, service: item || { title: "", desc: "", icon: "Monitor", color: "text-blue-500", gradient: "from-blue-500 to-cyan-500" } }));
    if(type === 'team') setForms(p => ({ ...p, team: item ? { ...item, id: item._id } : { id: null, name: "", role: "", image: "", desc: "" } }));
    // UPDATED: Populate all pricing fields correctly
    if(type === 'pricing') setForms(p => ({ ...p, pricing: item ? { ...item, id: item._id, features: item.features.join(','), missing: item.missing.join(',') } : { id: null, name: "", desc: "", priceMonthly: "", priceYearly: "", features: "", missing: "", popular: false } }));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let api = modalType === 'service' ? 'services' : modalType === 'pricing' ? 'pricing' : modalType + 's'; 
    let currentForm = forms[modalType];
    let body = { ...currentForm };
    
    if (modalType === 'project') body.tech = currentForm.tech.split(',').map(t => t.trim());
    if (modalType === 'pricing') {
        body.features = currentForm.features.split(',').filter(Boolean);
        body.missing = currentForm.missing.split(',').filter(Boolean);
    }

    try {
        const res = await fetch(`/api/${api}`, { method: body.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if(res.ok) { setIsModalOpen(false); fetchAllData(); showToast("Saved Successfully!"); } 
        else { showToast("Server Error", "error"); }
    } catch(e) { showToast("Operation Failed", "error"); }
    setLoading(false);
  };

  if (!isAuthenticated) return (
    <div className="h-screen flex items-center justify-center bg-[#050505] text-white overflow-hidden cursor-default selection:bg-blue-500/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050505] to-[#050505] pointer-events-none"></div>
        <div className="w-full max-w-sm p-8 z-10 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl">
            <div className="text-center mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-600/40">D</div>
                <h1 className="text-2xl font-bold">Admin Portal</h1>
                <p className="text-gray-500 text-sm">DevSamp Secure Gateway</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-center tracking-widest focus:border-blue-500 transition-all outline-none" placeholder="••••••••" autoFocus />
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-600/20">Unlock</button>
            </form>
        </div>
        <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden cursor-default selection:bg-blue-500/30">
        <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>

        <aside className={`fixed md:relative z-50 w-72 h-full bg-[#0a0a0a] border-r border-white/5 flex flex-col transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-xs">DS</div>
                    <span>DEVSAMP</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 mt-2">Overview</p>
                <NavItem icon={LayoutDashboard} label="Dashboard" id="dashboard" active={activeTab} set={setActiveTab} />
                <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 mt-6">Management</p>
                <NavItem icon={Users} label="Inquiries" id="leads" active={activeTab} set={setActiveTab} badge={data.leads.filter(l=>l.status==='New').length} />
                <NavItem icon={Briefcase} label="Team" id="team" active={activeTab} set={setActiveTab} />
                <NavItem icon={MessageCircle} label="Testimonials" id="reviews" active={activeTab} set={setActiveTab} />
                <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 mt-6">Content</p>
                <NavItem icon={ExternalLink} label="Projects" id="projects" active={activeTab} set={setActiveTab} />
                <NavItem icon={Layers} label="Services" id="services" active={activeTab} set={setActiveTab} />
                <NavItem icon={CreditCard} label="Pricing" id="pricing" active={activeTab} set={setActiveTab} />
            </div>
            <div className="p-4 border-t border-white/5">
                <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-900/10 rounded-xl transition-all font-medium text-sm">
                    <LogOut size={18} /> Sign Out
                </button>
            </div>
        </aside>

        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#050505]/80 backdrop-blur-xl z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-400"><Menu size={24}/></button>
                    <h2 className="text-lg font-bold capitalize flex items-center gap-2">
                        {activeTab} <span className="text-gray-600 font-normal text-sm hidden sm:inline">/ Overview</span>
                    </h2>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={fetchAllData} className={`p-2 rounded-full hover:bg-white/10 text-gray-400 transition-all ${loading && "animate-spin text-blue-500"}`}><Loader2 size={18}/></button>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border border-white/20"></div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                
                {activeTab === 'dashboard' && (
                    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard title="Total Inquiries" value={data.leads.length} icon={Users} color="blue" trend="+12%" />
                            <StatCard title="Active Projects" value={data.projects.length} icon={Briefcase} color="purple" />
                            <StatCard title="Services Active" value={data.services.length} icon={Layers} color="pink" />
                            <StatCard title="Client Reviews" value={data.reviews.length} icon={Star} color="yellow" />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-lg">Leads Overview</h3>
                                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">Last 7 Days</span>
                                </div>
                                <AnalyticsChart data={chartData} />
                            </div>
                            <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
                                <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                                <div className="space-y-4">
                                    {data.leads.slice(0, 4).map(l => (
                                        <div key={l._id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">{l.name.charAt(0)}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{l.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{l.service}</p>
                                            </div>
                                            <span className="text-[10px] text-gray-500">{new Date(l.createdAt).getDate()}/{new Date(l.createdAt).getMonth()+1}</span>
                                        </div>
                                    ))}
                                    {data.leads.length === 0 && <p className="text-sm text-gray-500">No recent activity.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'leads' && (
                    <div className="space-y-4 max-w-7xl mx-auto animate-fade-in">
                        <div className="flex flex-col md:flex-row gap-4 justify-between bg-[#0a0a0a] border border-white/5 p-4 rounded-2xl">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                                <input className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none transition-colors" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                            <button onClick={exportLeads} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-black font-bold text-sm rounded-xl hover:bg-gray-200 transition-colors"><Download size={16} /> Export CSV</button>
                        </div>
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/[0.02] text-gray-400 text-xs uppercase tracking-wider border-b border-white/5">
                                            <th className="p-5 font-medium">Client</th><th className="p-5 font-medium">Service</th><th className="p-5 font-medium">Message</th><th className="p-5 font-medium">Date</th><th className="p-5 font-medium">Status</th><th className="p-5 font-medium text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm text-gray-300 divide-y divide-white/5">
                                        {filteredLeads.map((lead) => (
                                            <tr key={lead._id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="p-5"><div className="font-bold text-white">{lead.name}</div><div className="text-xs text-gray-500">{lead.email}</div></td>
                                                <td className="p-5"><span className="bg-white/5 border border-white/5 px-2 py-1 rounded text-xs">{lead.service}</span></td>
                                                <td className="p-5 max-w-xs truncate text-gray-500" title={lead.message}>{lead.message}</td>
                                                <td className="p-5 text-xs text-gray-500 font-mono">{new Date(lead.createdAt).toLocaleDateString()}</td>
                                                <td className="p-5">
                                                    <div className="relative">
                                                        <select value={lead.status} onChange={(e) => handleUpdateStatus(lead._id, e.target.value)} className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold outline-none cursor-pointer border ${lead.status === 'New' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : lead.status === 'Closed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                                            <option className="bg-[#111]" value="New">New</option><option className="bg-[#111]" value="Contacted">Contacted</option><option className="bg-[#111]" value="Closed">Closed</option>
                                                        </select>
                                                        <Filter size={10} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none"/>
                                                    </div>
                                                </td>
                                                <td className="p-5 text-right"><button onClick={() => handleDelete('contact', lead._id)} className="text-gray-500 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredLeads.length === 0 && <div className="p-10 text-center text-gray-500">No leads found.</div>}
                            </div>
                        </div>
                    </div>
                )}

                {['services', 'team', 'projects', 'pricing', 'reviews'].includes(activeTab) && (
                    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-white capitalize">{activeTab}</h3>
                            {activeTab !== 'reviews' && (
                                <button onClick={() => openModal(activeTab.slice(0, -1))} className="bg-white text-black px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors shadow-lg hover:shadow-white/10">
                                    <Plus size={18} /> Add New
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {activeTab === 'projects' && data.projects.map(p => (
                                <div key={p._id} className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden group hover:border-white/20 transition-all">
                                    <div className="h-48 bg-gray-800 relative overflow-hidden">
                                        <img src={p.image} alt={p.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                            <button onClick={() => openModal('project', p)} className="p-2 bg-black/60 backdrop-blur rounded-lg text-white hover:bg-blue-600"><PenBox size={14}/></button>
                                            <button onClick={() => handleDelete('projects', p._id)} className="p-2 bg-black/60 backdrop-blur rounded-lg text-white hover:bg-red-600"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded uppercase tracking-wider">{p.category}</span>
                                            <a href={p.link} target="_blank" className="text-gray-500 hover:text-white"><ExternalLink size={16}/></a>
                                        </div>
                                        <h4 className="font-bold text-lg text-white">{p.title}</h4>
                                    </div>
                                </div>
                            ))}

                            {activeTab === 'services' && data.services.map(s => (
                                <div key={s._id} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl hover:border-white/20 transition-all relative group">
                                    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors`}><Layers size={24} /></div>
                                    <h4 className="font-bold text-lg text-white mb-2">{s.title}</h4>
                                    <p className="text-sm text-gray-400 line-clamp-2">{s.desc}</p>
                                    <button onClick={() => handleDelete('services', s._id)} className="absolute top-4 right-4 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18}/></button>
                                </div>
                            ))}

                            {activeTab === 'team' && data.team.map(t => (
                                <div key={t._id} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl flex items-center gap-5 hover:border-white/20 transition-all relative group">
                                    <img src={t.image} className="w-16 h-16 rounded-full object-cover border-2 border-white/10 group-hover:border-blue-500 transition-colors" alt={t.name}/>
                                    <div><h4 className="font-bold text-lg text-white">{t.name}</h4><p className="text-xs text-blue-400 uppercase font-bold tracking-wider">{t.role}</p></div>
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => openModal('team', t)} className="text-gray-400 hover:text-white"><PenBox size={14}/></button>
                                        <button onClick={() => handleDelete('team', t._id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                                    </div>
                                </div>
                            ))}

                            {activeTab === 'pricing' && data.pricing.map(p => (
                                <div key={p._id} className={`bg-[#0a0a0a] border p-6 rounded-2xl relative group ${p.popular ? 'border-blue-500/30' : 'border-white/5'}`}>
                                    {p.popular && <span className="absolute -top-3 left-4 bg-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Popular</span>}
                                    <h4 className="font-bold text-xl text-white mt-2">{p.name}</h4>
                                    <p className="text-sm text-gray-400 mt-1 mb-3 line-clamp-2">{p.desc}</p>
                                    <div className="text-2xl font-bold text-white mb-4">${p.priceMonthly}<span className="text-sm font-normal text-gray-500">/mo</span></div>
                                    <div className="flex gap-2 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openModal('pricing', p)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"><PenBox size={16}/></button>
                                        <button onClick={() => handleDelete('pricing', p._id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
                                    </div>
                                </div>
                            ))}

                            {activeTab === 'reviews' && data.reviews.map(r => (
                                <div key={r._id} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl relative group">
                                    <div className="flex items-center gap-3 mb-3">
                                        <img src={r.image} className="w-8 h-8 rounded-full" />
                                        <div><h4 className="font-bold text-sm">{r.name}</h4><div className="flex text-yellow-500 text-[10px] gap-0.5">{[...Array(r.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor"/>)}</div></div>
                                    </div>
                                    <p className="text-gray-400 text-xs italic">"{r.text}"</p>
                                    <button onClick={() => handleDelete('reviews', r._id)} className="absolute top-4 right-4 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>

        <AnimatePresence>
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#111] border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-blue-600/10 blur-3xl rounded-full pointer-events-none"></div>
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h3 className="text-2xl font-bold text-white capitalize">{modalType} Details</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white bg-white/5 p-2 rounded-full hover:bg-white/10 transition-all"><X size={20}/></button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                            {modalType === 'project' && (
                                <><Input placeholder="Project Title" value={forms.project.title} onChange={e=>setForms(p=>({...p, project:{...p.project, title:e.target.value}}))} />
                                <div className="flex gap-4"><Input placeholder="Category" value={forms.project.category} onChange={e=>setForms(p=>({...p, project:{...p.project, category:e.target.value}}))} /><Input placeholder="Live Link" value={forms.project.link} onChange={e=>setForms(p=>({...p, project:{...p.project, link:e.target.value}}))} /></div>
                                <Input placeholder="Image URL (Unsplash/Etc)" value={forms.project.image} onChange={e=>setForms(p=>({...p, project:{...p.project, image:e.target.value}}))} />
                                <TextArea placeholder="Tech Stack (comma separated)" value={forms.project.tech} onChange={e=>setForms(p=>({...p, project:{...p.project, tech:e.target.value}}))} /></>
                            )}
                            {modalType === 'service' && <><Input placeholder="Title" value={forms.service.title} onChange={e=>setForms(p=>({...p, service:{...p.service, title:e.target.value}}))} /><TextArea placeholder="Desc" value={forms.service.desc} onChange={e=>setForms(p=>({...p, service:{...p.service, desc:e.target.value}}))} /></>}
                            {modalType === 'team' && <><Input placeholder="Name" value={forms.team.name} onChange={e=>setForms(p=>({...p, team:{...p.team, name:e.target.value}}))} /><Input placeholder="Role" value={forms.team.role} onChange={e=>setForms(p=>({...p, team:{...p.team, role:e.target.value}}))} /><Input placeholder="Image URL" value={forms.team.image} onChange={e=>setForms(p=>({...p, team:{...p.team, image:e.target.value}}))} /></>}
                            
                            {modalType === 'pricing' && (
                                <>
                                    <Input placeholder="Plan Name (e.g. Pro)" value={forms.pricing.name} onChange={e=>setForms(p=>({...p, pricing:{...p.pricing, name:e.target.value}}))} />
                                    <Input placeholder="Description" value={forms.pricing.desc} onChange={e=>setForms(p=>({...p, pricing:{...p.pricing, desc:e.target.value}}))} />
                                    <div className="flex gap-4">
                                        <Input placeholder="Monthly Price ($)" value={forms.pricing.priceMonthly} onChange={e=>setForms(p=>({...p, pricing:{...p.pricing, priceMonthly:e.target.value}}))} />
                                        <Input placeholder="Yearly Price ($)" value={forms.pricing.priceYearly} onChange={e=>setForms(p=>({...p, pricing:{...p.pricing, priceYearly:e.target.value}}))} />
                                    </div>
                                    <TextArea placeholder="Features (comma separated)" value={forms.pricing.features} onChange={e=>setForms(p=>({...p, pricing:{...p.pricing, features:e.target.value}}))} />
                                    <TextArea placeholder="Missing Features (comma separated)" value={forms.pricing.missing} onChange={e=>setForms(p=>({...p, pricing:{...p.pricing, missing:e.target.value}}))} />
                                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                                        <input type="checkbox" checked={forms.pricing.popular} onChange={e=>setForms(p=>({...p, pricing:{...p.pricing, popular:e.target.checked}}))} className="w-5 h-5 accent-blue-600" />
                                        <span className="text-sm text-gray-300">Mark as Popular</span>
                                    </div>
                                </>
                            )}

                            <button disabled={loading} className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all flex justify-center items-center gap-2 mt-4">
                                {loading ? <Loader2 className="animate-spin" /> : "Save Changes"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </div>
  );
}

const NavItem = ({ icon: Icon, label, id, active, set, badge }) => (
    <button onClick={() => set(id)} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-sm font-medium group ${active === id ? "bg-white text-black font-bold shadow-lg shadow-white/5" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
        <Icon size={18} className={active === id ? "text-blue-600" : "text-gray-500 group-hover:text-white"} /> 
        {label}
        {badge > 0 && <span className="ml-auto bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
    </button>
);

const Input = (props) => <input {...props} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-all placeholder:text-gray-600" required />;
const TextArea = (props) => <textarea {...props} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-all min-h-[100px] placeholder:text-gray-600" required />;