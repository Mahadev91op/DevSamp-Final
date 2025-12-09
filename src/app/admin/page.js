"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  LayoutDashboard, Users, Layers, Plus, Loader2, LogOut, Menu, X, 
  CheckCircle, AlertCircle, Briefcase, PenBox, 
  Trash2, Search, ExternalLink, CreditCard, Star, MessageCircle, 
  TrendingUp, Filter, Rss, Download, Wand2, Eye, Mail, 
  ChevronLeft, ChevronRight, Image as ImageIcon, Maximize2, Minimize2, 
  BarChart3, Activity, ArrowRight, Zap, FolderKanban, Clock, Save, Link as LinkIcon, DollarSign, FileText,
  UploadCloud, File, Calendar as CalendarIcon // <-- NEW ICON
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- HELPERS (SAME AS BEFORE) ---
const getTimeRangeConfig = (range) => {
    const now = new Date();
    switch(range) {
        case '1D': return { days: 1, labelFormat: 'hour' };
        case '7D': return { days: 7, labelFormat: 'day' };
        case '1M': return { days: 30, labelFormat: 'date' };
        case '3M': return { days: 90, labelFormat: 'month' };
        case '6M': return { days: 180, labelFormat: 'month' };
        case '1Y': return { days: 365, labelFormat: 'month' };
        case '3Y': return { days: 1095, labelFormat: 'year' };
        default: return { days: 7, labelFormat: 'day' };
    }
};

const filterAndGroupData = (items, range) => {
    const { days, labelFormat } = getTimeRangeConfig(range);
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - days);

    const filtered = items.filter(item => new Date(item.createdAt) >= startDate);
    const groups = {};
    const labels = [];
    
    if (labelFormat === 'hour') {
        for(let i=0; i<24; i++) {
            const d = new Date(startDate);
            d.setHours(d.getHours() + i);
            const key = d.toLocaleTimeString([], { hour: '2-digit' });
            groups[key] = 0;
            labels.push(key);
        }
    } else if (labelFormat === 'month' || labelFormat === 'year') {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        for (let i = (labelFormat === 'year' ? 3 : 6); i >= 0; i--) {
             const d = new Date();
             if(labelFormat === 'year') d.setFullYear(d.getFullYear() - i);
             else d.setMonth(d.getMonth() - i);
             const key = labelFormat === 'year' ? d.getFullYear() : `${monthNames[d.getMonth()]}`;
             groups[key] = 0;
             if(!labels.includes(String(key))) labels.push(String(key));
        }
    } else {
        for(let i=0; i<days; i++) {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i + 1);
            const key = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
            groups[key] = 0;
            labels.push(key);
        }
    }

    filtered.forEach(item => {
        const d = new Date(item.createdAt);
        let key;
        if (labelFormat === 'hour') key = d.toLocaleTimeString([], { hour: '2-digit' });
        else if (labelFormat === 'month') key = d.toLocaleString('default', { month: 'short' });
        else if (labelFormat === 'year') key = d.getFullYear();
        else key = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });

        if (groups[key] !== undefined) groups[key]++;
    });

    const finalData = labels.map(l => groups[l] || 0);
    return { labels, data: finalData };
};

const gradientOptions = [
    { name: "Blue", class: "from-blue-500 to-cyan-500" },
    { name: "Purple", class: "from-purple-500 to-pink-500" },
    { name: "Orange", class: "from-orange-500 to-red-500" },
    { name: "Green", class: "from-emerald-500 to-green-500" },
    { name: "Dark", class: "from-gray-700 to-black" },
];

const LineChart = ({ data, labels, expanded, onToggleExpand, timeRange, setTimeRange, color = "blue" }) => {
  const [hoveredVal, setHoveredVal] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const h = expanded ? 400 : 200; 
  const w = expanded ? 1000 : 600;
  const max = Math.max(...data) || 1;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (val / max) * (h * 0.7) - 20; 
    return [x, y];
  });
  const pathD = points.reduce((acc, [x, y], i, arr) => {
    if (i === 0) return `M ${x},${y}`;
    const [px, py] = arr[i - 1];
    const cp1x = px + (x - px) / 2;
    const cp1y = py;
    const cp2x = px + (x - px) / 2;
    const cp2y = y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
  }, "");
  return (
    <div className={`relative bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl transition-all duration-500 ease-in-out ${expanded ? "col-span-full row-span-2 z-50 scale-[1.01] shadow-2xl" : "col-span-1 shadow-sm"}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h3 className={`font-bold text-white flex items-center gap-2 ${expanded ? "text-2xl" : "text-lg"}`}>
                <Activity size={expanded ? 24 : 18} className={`text-${color}-500`}/> Leads Overview
            </h3>
            <p className="text-gray-500 text-xs mt-1">Inquiries received over time.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-black border border-white/10 rounded-lg p-1 overflow-x-auto max-w-full">
                {['1D', '7D', '1M', '3M', '1Y'].map(r => (
                    <button key={r} onClick={() => setTimeRange(r)} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all whitespace-nowrap ${timeRange === r ? `bg-${color}-600 text-white` : "text-gray-500 hover:text-white"}`}>{r}</button>
                ))}
            </div>
            <button onClick={onToggleExpand} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">{expanded ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}</button>
        </div>
      </div>
      <div className={`w-full relative group select-none ${expanded ? "h-[400px]" : "h-[200px]"}`}>
        <AnimatePresence>
            {hoveredVal !== null && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`absolute bg-${color}-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 z-20`} style={{ left: `${(hoveredIndex / (data.length - 1)) * 100}%`, top: points[hoveredIndex][1] - 40 }}>{hoveredVal} Leads<div className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-${color}-600 rotate-45`}></div></motion.div>
            )}
        </AnimatePresence>
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full overflow-visible preserve-3d">
            <defs>
                <linearGradient id={`grad-${color}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color === 'blue' ? '#3b82f6' : '#a855f7'} stopOpacity="0.4" /><stop offset="100%" stopColor={color === 'blue' ? '#3b82f6' : '#a855f7'} stopOpacity="0" />
                </linearGradient>
            </defs>
            <line x1="0" y1={h} x2={w} y2={h} stroke="#222" strokeWidth="1" /><line x1="0" y1={0} x2={w} y2={0} stroke="#222" strokeWidth="1" strokeDasharray="4 4" /><line x1="0" y1={h/2} x2={w} y2={h/2} stroke="#222" strokeWidth="1" strokeDasharray="4 4" />
            <path d={`${pathD} L ${w},${h} L 0,${h} Z`} fill={`url(#grad-${color})`} />
            <path d={pathD} fill="none" stroke={color === 'blue' ? '#3b82f6' : '#a855f7'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={`drop-shadow-[0_0_15px_rgba(${color === 'blue' ? '59,130,246' : '168,85,247'},0.5)]`} />
            {points.map(([x, y], i) => (<circle key={i} cx={x} cy={y} r="6" fill="#0a0a0a" stroke={color === 'blue' ? '#3b82f6' : '#a855f7'} strokeWidth="3" className="cursor-pointer transition-all duration-200 hover:r-8 hover:fill-white hover:stroke-white z-10" onMouseEnter={() => { setHoveredVal(data[i]); setHoveredIndex(i); }} onMouseLeave={() => { setHoveredVal(null); setHoveredIndex(null); }}/>))}
        </svg>
        <div className="flex justify-between mt-4 text-[10px] text-gray-500 font-mono font-bold uppercase tracking-widest">{labels.map((l, i) => (<span key={i} className={`${i % 2 !== 0 && !expanded ? "hidden" : "block"}`}>{l}</span>))}</div>
      </div>
    </div>
  );
};

const BarChart = ({ data, labels, expanded, onToggleExpand, color = "purple" }) => {
    const max = Math.max(...data) || 1;
    return (
        <div className={`bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl transition-all duration-500 ease-in-out relative overflow-hidden ${expanded ? "col-span-full row-span-2 z-50 scale-[1.01] shadow-2xl" : "col-span-1 shadow-sm"}`}>
            <div className="flex justify-between items-center mb-8">
                <div><h3 className={`font-bold text-white flex items-center gap-2 ${expanded ? "text-2xl" : "text-lg"}`}><BarChart3 size={expanded ? 24 : 18} className={`text-${color}-500`}/> Popular Services</h3><p className="text-gray-500 text-xs mt-1">Most requested services by clients.</p></div>
                <button onClick={onToggleExpand} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">{expanded ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}</button>
            </div>
            <div className={`w-full flex items-end justify-between gap-2 md:gap-4 ${expanded ? "h-[400px]" : "h-[200px]"}`}>
                {data.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-xs font-bold px-2 py-1 rounded mb-2 z-10 pointer-events-none">{val}</div>
                        <motion.div initial={{ height: 0 }} animate={{ height: `${(val / max) * 100}%` }} transition={{ duration: 1, delay: i * 0.1, type: "spring" }} className={`w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-${color}-900/50 to-${color}-500/80 border-t border-x border-${color}-400/30 hover:to-${color}-400 transition-all cursor-pointer relative overflow-hidden`}><div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div></motion.div>
                        <span className="text-[9px] md:text-[10px] text-gray-500 mt-3 font-mono uppercase tracking-wider truncate w-full text-center">{labels[i]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Toast = ({ message, type, onClose }) => (<motion.div initial={{ opacity: 0, y: -20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.9 }} className={`fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl backdrop-blur-xl border ${type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>{type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}<span className="text-sm font-bold tracking-wide">{message}</span></motion.div>);
const StatCard = ({ title, value, icon: Icon, color, trend, onClick }) => (<div onClick={onClick} className="bg-[#0f0f0f] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-all hover:-translate-y-1 duration-300 shadow-xl cursor-pointer"><div className={`absolute -right-6 -top-6 w-24 h-24 bg-${color}-500/10 blur-2xl rounded-full group-hover:bg-${color}-500/20 transition-all`}></div><div className="flex justify-between items-start mb-4 relative z-10"><div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400 border border-${color}-500/10`}><Icon size={22} /></div>{trend && (<span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1"><TrendingUp size={10} /> {trend}</span>)}</div><h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</h3><div className="flex items-center gap-2"><p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">{title}</p><ArrowRight size={12} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" /></div></div>);
const Pagination = ({ total, perPage, current, onChange }) => { const pages = Math.ceil(total / perPage); if (pages <= 1) return null; return (<div className="flex items-center justify-end gap-2 mt-4"><button disabled={current === 1} onClick={() => onChange(current - 1)} className="p-2 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft size={16}/></button><span className="text-xs text-gray-400">Page {current} of {pages}</span><button disabled={current === pages} onClick={() => onChange(current + 1)} className="p-2 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight size={16}/></button></div>); };

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard"); 
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [uploading, setUploading] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); 
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewLead, setViewLead] = useState(null);
  const [leadsTimeRange, setLeadsTimeRange] = useState('7D');
  const [expandedChart, setExpandedChart] = useState(null); 
  
  // --- NEW: CALENDAR STATE ---
  const [calendarDate, setCalendarDate] = useState(new Date());

  const [data, setData] = useState({ leads: [], services: [], team: [], projects: [], pricing: [], reviews: [], blogs: [], clientProjects: [] });
  
  const [forms, setForms] = useState({
    project: { id: null, title: "", category: "", image: "", tech: "", link: "" },
    service: { title: "", desc: "", icon: "Monitor", color: "text-blue-500", gradient: "from-blue-500 to-cyan-500" },
    team: { id: null, name: "", role: "", image: "", desc: "" },
    pricing: { id: null, name: "", desc: "", priceMonthly: "", priceYearly: "", features: "", missing: "", popular: false, gradient: "from-gray-500 to-gray-700" },
    blog: { id: null, link: "", title: "", desc: "", image: "", category: "", platform: "other" },
    review: { id: null, name: "", role: "", text: "", rating: 5, image: "" },
    clientProject: { 
        id: null, title: "", clientEmail: "", status: "Active", progress: 0, nextMilestone: "Discovery", dueDate: "TBD", 
        description: "", budget: "", paymentStatus: "Pending", links: [], 
        documents: [], 
        stages: [
            { id: 1, title: "Discovery", status: "pending", date: "Pending" },
            { id: 2, title: "UI/UX Design", status: "pending", date: "Pending" },
            { id: 3, title: "Development", status: "pending", date: "Pending" },
            { id: 4, title: "Testing", status: "pending", date: "Pending" },
            { id: 5, title: "Deployment", status: "pending", date: "Pending" }
        ], 
        updates: [] 
    }
  });

  const showToast = (message, type = "success") => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

  const lineChartData = useMemo(() => filterAndGroupData(data.leads, leadsTimeRange), [data.leads, leadsTimeRange]);
  const barChartData = useMemo(() => { const counts = {}; data.leads.forEach(l => { const svc = l.service || "General"; counts[svc] = (counts[svc] || 0) + 1; }); const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 5); return { labels: sorted.map(s => s[0]), data: sorted.map(s => s[1]) }; }, [data.leads]);

  const itemsPerPage = 8;
  const filteredData = useMemo(() => {
    let list = [];
    if(activeTab === 'leads') list = data.leads;
    else if(activeTab === 'projects') list = data.projects;
    else if(activeTab === 'blogs') list = data.blogs;
    else if(activeTab === 'team') list = data.team;
    else if(activeTab === 'services') list = data.services;
    else if(activeTab === 'reviews') list = data.reviews;
    else if(activeTab === 'pricing') list = data.pricing;
    else if(activeTab === 'client-projects') list = data.clientProjects; 

    if (!searchTerm) return list;
    return list.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase())));
  }, [activeTab, data, searchTerm]);

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleLogin = (e) => { e.preventDefault(); if (password === "devsamp_boss_123") { setIsAuthenticated(true); fetchAllData(); } else { showToast("Invalid Passkey", "error"); } };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const endpoints = ["contact", "services", "team", "projects", "pricing", "reviews", "blogs", "client-projects"];
      const responses = await Promise.all(endpoints.map(ep => fetch(`/api/${ep}`).then(res => res.json())));
      setData({
        leads: responses[0].contacts || [],
        services: responses[1].services || [],
        team: responses[2].team || [],
        projects: responses[3].projects || [],
        pricing: responses[4].pricing || [],
        reviews: responses[5].reviews || [],
        blogs: responses[6].blogs || [],
        clientProjects: responses[7].projects || []
      });
    } catch (e) { showToast("Sync Failed", "error"); }
    setLoading(false);
  };

  const handleExtractMeta = async () => {
    if (!forms.blog.link) return showToast("Please enter a link first", "error");
    setExtracting(true);
    try {
        const res = await fetch("/api/extract", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: forms.blog.link }) });
        const meta = await res.json();
        if (res.ok) {
            setForms(prev => ({ ...prev, blog: { ...prev.blog, title: meta.title || "", desc: meta.desc || "", image: meta.image || "", platform: meta.platform || "other", category: meta.platform === 'youtube' ? 'Video' : 'Social' } }));
            showToast("Data Fetched!");
        } else { showToast("Could not fetch data", "error"); }
    } catch (e) { showToast("Extraction Error", "error"); }
    setExtracting(false);
  };

  const handleDelete = async (api, id) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    try { await fetch(`/api/${api}?id=${id}`, { method: "DELETE" }); showToast("Item Deleted"); fetchAllData(); } catch(e) { showToast("Delete Failed", "error"); }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
        await fetch("/api/contact", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
        const updatedLeads = data.leads.map(l => l._id === id ? { ...l, status } : l);
        setData(prev => ({...prev, leads: updatedLeads}));
        showToast("Status Updated");
    } catch(e) { showToast("Update Failed", "error"); }
  };

  const getTypeFromTab = (tab) => {
    const map = { projects: 'project', services: 'service', blogs: 'blog', team: 'team', pricing: 'pricing', reviews: 'review', 'client-projects': 'clientProject' };
    return map[tab] || null;
  };

  const openModal = (type, item = null) => {
    if(!forms[type]) return;
    setModalType(type);
    
    if(type === 'clientProject') {
        setForms(p => ({ 
            ...p, 
            clientProject: item ? { ...item, id: item._id, links: item.links || [], documents: item.documents || [] } : { 
                id: null, title: "", clientEmail: "", status: "Active", progress: 0, nextMilestone: "Discovery", dueDate: "TBD", 
                description: "", budget: "", paymentStatus: "Pending", links: [], documents: [],
                stages: [
                    { id: 1, title: "Discovery", status: "pending", date: "Pending" },
                    { id: 2, title: "UI/UX Design", status: "pending", date: "Pending" },
                    { id: 3, title: "Development", status: "pending", date: "Pending" },
                    { id: 4, title: "Testing", status: "pending", date: "Pending" },
                    { id: 5, title: "Deployment", status: "pending", date: "Pending" }
                ], 
                updates: [] 
            } 
        }));
    } 
    else if(type === 'project') setForms(p => ({ ...p, project: item ? { ...item, id: item._id, tech: item.tech.join(', ') } : { id: null, title: "", category: "", image: "", tech: "", link: "" } }));
    else if(type === 'service') setForms(p => ({ ...p, service: item ? { ...item, id: item._id } : { title: "", desc: "", icon: "Monitor", color: "text-blue-500", gradient: "from-blue-500 to-cyan-500" } }));
    else if(type === 'team') setForms(p => ({ ...p, team: item ? { ...item, id: item._id } : { id: null, name: "", role: "", image: "", desc: "" } }));
    else if(type === 'pricing') setForms(p => ({ ...p, pricing: item ? { ...item, id: item._id, features: item.features.join(','), missing: item.missing.join(','), popular: item.popular, gradient: item.gradient || "from-gray-500 to-gray-700" } : { id: null, name: "", desc: "", priceMonthly: "", priceYearly: "", features: "", missing: "", popular: false, gradient: "from-gray-500 to-gray-700" } }));
    else if(type === 'blog') setForms(p => ({ ...p, blog: item ? { ...item, id: item._id } : { id: null, link: "", title: "", desc: "", image: "", category: "", platform: "other" } }));
    else if(type === 'review') setForms(p => ({ ...p, review: item ? { ...item, id: item._id } : { id: null, name: "", role: "", text: "", rating: 5, image: "" } }));

    setIsModalOpen(true);
  };

  const handleAddNew = () => { const type = getTypeFromTab(activeTab); if(type) openModal(type); };
  const handleEditItem = (item) => { const type = getTypeFromTab(activeTab); if(type) openModal(type, item); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const apiMap = { project: 'projects', service: 'services', blog: 'blogs', team: 'team', pricing: 'pricing', review: 'reviews', clientProject: 'client-projects' };
    let api = apiMap[modalType];
    let currentForm = forms[modalType];
    let body = { ...currentForm };
    if (modalType === 'project') body.tech = currentForm.tech.split(',').map(t => t.trim());
    if (modalType === 'pricing') { 
        body.features = currentForm.features.split(',').map(s=>s.trim()).filter(Boolean); 
        body.missing = currentForm.missing.split(',').map(s=>s.trim()).filter(Boolean); 
    }

    try {
        const res = await fetch(`/api/${api}`, { method: body.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if(res.ok) { setIsModalOpen(false); fetchAllData(); showToast("Saved Successfully!"); } 
        else { showToast("Server Error", "error"); }
    } catch(e) { showToast("Operation Failed", "error"); }
    setLoading(false);
  };

  const handleAdminFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData
        });
        const uploadData = await uploadRes.json();

        if (uploadRes.ok) {
            const newDoc = {
                name: file.name,
                url: uploadData.url,
                uploadedBy: "Admin",
                date: new Date().toLocaleDateString()
            };

            setForms(p => ({
                ...p,
                clientProject: {
                    ...p.clientProject,
                    documents: [newDoc, ...p.clientProject.documents]
                }
            }));
            showToast("File Ready (Click Save to Confirm)");
        } else {
            showToast("Upload Failed", "error");
        }
    } catch (error) {
        showToast("Network Error", "error");
    }
    setUploading(false);
  };

  const addProjectUpdate = () => {
    const newUpdate = { title: "New Update", desc: "Description here", date: new Date().toLocaleDateString() };
    setForms(prev => ({ ...prev, clientProject: { ...prev.clientProject, updates: [newUpdate, ...prev.clientProject.updates] } }));
  };

  const addProjectLink = () => {
    const newLink = { title: "New Resource", url: "https://" };
    setForms(prev => ({ ...prev, clientProject: { ...prev.clientProject, links: [...prev.clientProject.links, newLink] } }));
  };

  if (!isAuthenticated) return (
    <div className="h-screen flex items-center justify-center bg-[#050505] text-white overflow-hidden cursor-default selection:bg-blue-500/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050505] to-[#050505] pointer-events-none"></div>
        <div className="w-full max-w-sm p-8 z-10 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl relative m-4">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-600/30">DS</div>
                <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                <p className="text-gray-500 text-sm">Enter your master key to access the mainframe.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-5">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-center tracking-[0.5em] focus:border-blue-500 transition-all outline-none text-lg" placeholder="••••••••" autoFocus />
                <button className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">Access Dashboard <ChevronRight size={16}/></button>
            </form>
        </div>
        <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden cursor-default selection:bg-blue-500/30 relative">
        <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>
        <AnimatePresence>{isSidebarOpen && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden" />)}</AnimatePresence>

        <aside className={`fixed md:relative z-50 w-72 h-full bg-[#0a0a0a] border-r border-white/5 flex flex-col transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center"><div className="flex items-center gap-3 font-bold text-xl tracking-tight"><div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-xs shadow-blue-500/50 shadow-md">DS</div><span>DEVSAMP<span className="text-blue-500 text-xs align-top ml-1">ADMIN</span></span></div><button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400"><X size={20}/></button></div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 mt-2">Overview</p>
                <NavItem icon={LayoutDashboard} label="Dashboard" id="dashboard" active={activeTab} set={(id) => { setActiveTab(id); setSidebarOpen(false); }} />
                <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 mt-6">CRM</p>
                <NavItem icon={Users} label="Inquiries (Leads)" id="leads" active={activeTab} set={(id) => { setActiveTab(id); setSidebarOpen(false); }} badge={data.leads.filter(l=>l.status==='New').length} />
                <NavItem icon={FolderKanban} label="Client Projects" id="client-projects" active={activeTab} set={(id) => { setActiveTab(id); setSidebarOpen(false); }} /> 
                <NavItem icon={CalendarIcon} label="Project Calendar" id="calendar" active={activeTab} set={(id) => { setActiveTab(id); setSidebarOpen(false); }} /> {/* NEW ITEM */}
                <NavItem icon={MessageCircle} label="Testimonials" id="reviews" active={activeTab} set={(id) => { setActiveTab(id); setSidebarOpen(false); }} />
                <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 mt-6">CMS</p>
                <NavItem icon={ExternalLink} label="Projects (Portfolio)" id="projects" active={activeTab} set={(id) => { setActiveTab(id); setSidebarOpen(false); }} />
                <NavItem icon={Briefcase} label="Our Team" id="team" active={activeTab} set={(id) => { setActiveTab(id); setSidebarOpen(false); }} />
                <NavItem icon={Layers} label="Services" id="services" active={activeTab} set={(id) => { setActiveTab(id); setSidebarOpen(false); }} />
                <NavItem icon={CreditCard} label="Pricing Plans" id="pricing" active={activeTab} set={(id) => { setActiveTab(id); setSidebarOpen(false); }} />
                <NavItem icon={Rss} label="Blogs & News" id="blogs" active={activeTab} set={(id) => { setActiveTab(id); setSidebarOpen(false); }} />
            </div>
            <div className="p-4 border-t border-white/5"><button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-900/10 rounded-xl transition-all font-medium text-sm"><LogOut size={18} /> Sign Out</button></div>
        </aside>

        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-[#050505]/80 backdrop-blur-xl z-20">
                <div className="flex items-center gap-3 md:gap-4"><button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-400 p-1"><Menu size={24}/></button><h2 className="text-base md:text-lg font-bold capitalize flex items-center gap-2 truncate">{activeTab.replace('-', ' ')} <span className="text-gray-600 font-normal text-sm hidden sm:inline">/ Management</span></h2></div>
                <div className="flex items-center gap-3 md:gap-4"><button onClick={fetchAllData} className={`p-2 rounded-full hover:bg-white/10 text-gray-400 transition-all ${loading && "animate-spin text-blue-500"}`} title="Refresh Data"><Loader2 size={18}/></button><div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/20 flex items-center justify-center text-xs font-bold">A</div></div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
                
                {activeTab === 'dashboard' && (
                    <div className="space-y-6 md:space-y-8 animate-fade-in max-w-7xl mx-auto pb-20 md:pb-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard title="Total Leads" value={data.leads.length} icon={Users} color="blue" trend="+12%" onClick={() => setActiveTab('leads')} />
                            <StatCard title="Active Clients" value={data.clientProjects.length} icon={FolderKanban} color="green" onClick={() => setActiveTab('client-projects')} />
                            <StatCard title="Services" value={data.services.length} icon={Layers} color="pink" onClick={() => setActiveTab('services')} />
                            <StatCard title="Blogs Posted" value={data.blogs.length} icon={Rss} color="orange" onClick={() => setActiveTab('blogs')} />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <LineChart data={lineChartData.data} labels={lineChartData.labels} expanded={expandedChart === 'line'} onToggleExpand={() => setExpandedChart(expandedChart === 'line' ? null : 'line')} timeRange={leadsTimeRange} setTimeRange={setLeadsTimeRange} color="blue" />
                            <BarChart data={barChartData.data} labels={barChartData.labels} expanded={expandedChart === 'bar'} onToggleExpand={() => setExpandedChart(expandedChart === 'bar' ? null : 'bar')} color="purple" />
                        </div>
                    </div>
                )}

                {activeTab === 'leads' && (
                    <div className="space-y-4 max-w-7xl mx-auto animate-fade-in pb-20 md:pb-0">
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
                                    <thead><tr className="bg-white/[0.02] text-gray-400 text-xs uppercase tracking-wider border-b border-white/5"><th className="p-5 font-medium">Client Info</th><th className="p-5 font-medium">Interest</th><th className="p-5 font-medium">Date</th><th className="p-5 font-medium">Status</th><th className="p-5 font-medium text-right">Actions</th></tr></thead>
                                    <tbody className="text-sm text-gray-300 divide-y divide-white/5">
                                        {paginatedData.map((lead) => (
                                            <tr key={lead._id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="p-5"><div className="font-bold text-white text-base">{lead.name}</div><div className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Mail size={10}/> {lead.email}</div></td>
                                                <td className="p-5"><span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-lg text-xs font-medium">{lead.service}</span></td>
                                                <td className="p-5 text-xs text-gray-500 font-mono">{new Date(lead.createdAt).toLocaleDateString()}</td>
                                                <td className="p-5">
                                                    <select value={lead.status} onChange={(e) => handleUpdateStatus(lead._id, e.target.value)} className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold outline-none cursor-pointer border transition-all ${lead.status === 'New' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : lead.status === 'Closed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                                        <option className="bg-[#111]" value="New">New</option><option className="bg-[#111]" value="Contacted">Contacted</option><option className="bg-[#111]" value="Closed">Closed</option>
                                                    </select>
                                                </td>
                                                <td className="p-5 text-right"><div className="flex justify-end gap-2 opacity-100 md:opacity-60 md:group-hover:opacity-100 transition-opacity"><button onClick={() => setViewLead(lead)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-blue-400 transition-colors" title="View Details"><Eye size={16}/></button><button onClick={() => handleDelete('contact', lead._id)} className="p-2 bg-white/5 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors" title="Delete"><Trash2 size={16}/></button></div></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 border-t border-white/5 bg-[#0a0a0a]"><Pagination total={filteredData.length} perPage={itemsPerPage} current={currentPage} onChange={setCurrentPage} /></div>
                        </div>
                    </div>
                )}

                {activeTab === 'client-projects' && (
                    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-20 md:pb-0">
                        <div className="flex justify-between items-center bg-[#0a0a0a] p-4 rounded-2xl border border-white/5">
                            <h3 className="text-xl font-bold flex items-center gap-2"><FolderKanban className="text-blue-500"/> Manage Client Projects</h3>
                            <button onClick={handleAddNew} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-all"><Plus size={16}/> New Project</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {paginatedData.map((project) => (
                                <div key={project._id} onClick={() => handleEditItem(project)} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 cursor-pointer hover:border-blue-500/50 hover:bg-white/[0.02] transition-all group relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-blue-900/20 text-blue-400 rounded-xl"><Briefcase size={20}/></div>
                                        <div className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${project.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>{project.status}</div>
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{project.title}</h4>
                                    <p className="text-xs text-gray-500 mb-6">{project.clientEmail}</p>
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-gray-400 font-bold">
                                            <span>Progress</span>
                                            <span>{project.progress}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${project.progress}%` }}></div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 pt-4 border-t border-white/5 flex justify-between text-xs text-gray-500">
                                        <span className="flex items-center gap-1"><Clock size={12}/> {project.nextMilestone}</span>
                                        <span>Due: {project.dueDate}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {paginatedData.length === 0 && <div className="text-center text-gray-500 py-10">No active client projects. Create one!</div>}
                    </div>
                )}

                {/* --- NEW: CALENDAR TAB --- */}
                {activeTab === 'calendar' && (
                    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-20 md:pb-0">
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <CalendarIcon className="text-blue-500" /> Project Deadlines
                                </h3>
                                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                                    <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))} className="p-2 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors"><ChevronLeft size={18}/></button>
                                    <span className="text-sm font-bold text-white px-2 min-w-[120px] text-center">{calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                    <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))} className="p-2 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors"><ChevronRight size={18}/></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-1 md:gap-2">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                    <div key={d} className="text-center text-xs font-bold text-gray-600 uppercase py-2">{d}</div>
                                ))}
                                {(() => {
                                    const year = calendarDate.getFullYear();
                                    const month = calendarDate.getMonth();
                                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                                    const firstDay = new Date(year, month, 1).getDay();
                                    const days = [];

                                    // Empty cells for previous month
                                    for (let i = 0; i < firstDay; i++) {
                                        days.push(<div key={`empty-${i}`} className="h-16 md:h-24 bg-transparent border border-white/5 opacity-10 rounded-lg"></div>);
                                    }

                                    // Days with data
                                    for (let d = 1; d <= daysInMonth; d++) {
                                        const dateStr = new Date(year, month, d).toLocaleDateString();
                                        // Simple string matching. Note: dueDate needs to be parseable or exact string match if stored nicely
                                        const dueProjects = data.clientProjects.filter(p => {
                                            // Try to parse p.dueDate. If "TBD", ignore.
                                            const pDate = new Date(p.dueDate);
                                            return !isNaN(pDate) && pDate.getDate() === d && pDate.getMonth() === month && pDate.getFullYear() === year;
                                        });

                                        const isToday = new Date().getDate() === d && new Date().getMonth() === month && new Date().getFullYear() === year;

                                        days.push(
                                            <div key={d} className={`h-16 md:h-24 bg-white/5 border ${isToday ? 'border-blue-500' : 'border-white/5'} rounded-lg p-2 flex flex-col hover:bg-white/10 transition-colors group relative overflow-hidden`}>
                                                <span className={`text-xs font-bold mb-1 ${isToday ? 'text-blue-400' : 'text-gray-500 group-hover:text-white'}`}>{d}</span>
                                                <div className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                                                    {dueProjects.map(p => (
                                                        <div key={p._id} className="text-[9px] bg-blue-600/20 text-blue-300 px-1.5 py-0.5 rounded truncate border border-blue-500/20 cursor-pointer hover:bg-blue-600 hover:text-white transition-colors" onClick={() => handleEditItem(p)} title={p.title}>
                                                            {p.title}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return days;
                                })()}
                            </div>
                        </div>
                    </div>
                )}

                {['services', 'team', 'projects', 'pricing', 'reviews', 'blogs'].includes(activeTab) && (
                    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-20 md:pb-0">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none" placeholder={`Search ${activeTab}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                            {activeTab !== 'reviews' && (
                                <button onClick={handleAddNew} className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors shadow-lg shadow-white/5 w-full md:w-auto justify-center">
                                    <Plus size={18} /> Add New {getTypeFromTab(activeTab)}
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {paginatedData.map((item) => (
                                <div key={item._id} className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden group hover:border-white/20 transition-all flex flex-col relative">
                                    {(item.image || activeTab === 'blogs' || activeTab === 'projects') && (
                                        <div className="h-48 bg-gray-900 relative overflow-hidden">
                                            {item.image ? (
                                                <img src={item.image} alt={item.title || item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-600"><ImageIcon size={32}/></div>
                                            )}
                                            <div className="absolute top-3 right-3 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all md:translate-y-2 md:group-hover:translate-y-0 z-10">
                                                <button onClick={() => handleEditItem(item)} className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:bg-blue-600 transition-colors"><PenBox size={14}/></button>
                                                <button onClick={() => handleDelete(activeTab === 'team' ? 'team' : activeTab, item._id)} className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:bg-red-600 transition-colors"><Trash2 size={14}/></button>
                                            </div>
                                        </div>
                                    )}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex gap-2 mb-3">
                                            {item.category && <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded uppercase tracking-wider">{item.category}</span>}
                                            {item.role && <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded uppercase tracking-wider">{item.role}</span>}
                                            {item.popular && <span className="text-[10px] font-bold text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded uppercase tracking-wider">Popular</span>}
                                        </div>
                                        <h4 className="font-bold text-lg text-white mb-1 line-clamp-1">{item.title || item.name}</h4>
                                        <p className="text-sm text-gray-400 line-clamp-2 flex-1">{item.desc || item.text || item.message}</p>
                                        {item.priceMonthly && <div className="mt-4 text-xl font-bold">${item.priceMonthly}<span className="text-xs font-normal text-gray-500">/mo</span></div>}
                                        {activeTab === 'services' && !item.image && (
                                            <div className="absolute top-4 right-4 p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-white"><Layers size={20}/></div>
                                        )}
                                        {activeTab === 'reviews' && (
                                            <div className="flex gap-1 mt-3 text-yellow-500">{[...Array(item.rating || 5)].map((_,i)=><Star key={i} size={12} fill="currentColor"/>)}</div>
                                        )}
                                        {!item.image && activeTab !== 'blogs' && activeTab !== 'projects' && (
                                            <div className="flex gap-2 mt-4 pt-4 border-t border-white/5 justify-end">
                                                <button onClick={() => handleEditItem(item)} className="text-xs font-bold text-blue-400 hover:text-white uppercase tracking-wider">Edit</button>
                                                <button onClick={() => handleDelete(activeTab === 'reviews' ? 'reviews' : activeTab, item._id)} className="text-xs font-bold text-red-400 hover:text-white uppercase tracking-wider">Delete</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {paginatedData.length === 0 && (
                            <div className="text-center py-20 bg-[#0a0a0a] rounded-2xl border border-white/5">
                                <div className="inline-block p-4 rounded-full bg-white/5 mb-4"><Search size={32} className="text-gray-600"/></div>
                                <h3 className="text-xl font-bold text-gray-300">No results found</h3>
                                <p className="text-gray-500">Try adding a new item or clear your search.</p>
                            </div>
                        )}

                        <Pagination total={filteredData.length} perPage={itemsPerPage} current={currentPage} onChange={setCurrentPage} />
                    </div>
                )}
            </div>
        </main>

        <AnimatePresence>
            {viewLead && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#111] border border-white/10 p-8 rounded-2xl w-full max-w-lg shadow-2xl relative">
                        <button onClick={() => setViewLead(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
                        <h3 className="text-2xl font-bold text-white mb-1">{viewLead.name}</h3>
                        <p className="text-sm text-gray-500 mb-6 flex items-center gap-2"><Mail size={12}/> {viewLead.email}</p>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 mb-6"><label className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-2 block">Message</label><p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{viewLead.message}</p></div>
                        <div className="flex gap-4"><a href={`mailto:${viewLead.email}`} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"><Mail size={18}/> Reply via Email</a><button onClick={() => { setViewLead(null); handleDelete('contact', viewLead._id); }} className="px-4 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={18}/></button></div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        <AnimatePresence>
            {isModalOpen && forms[modalType] && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#111] border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="absolute top-0 right-0 p-32 bg-blue-600/10 blur-3xl rounded-full pointer-events-none"></div>
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h3 className="text-2xl font-bold text-white capitalize">{forms[modalType].id ? "Edit" : "Add New"} {modalType.replace('clientProject', 'Project')}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white bg-white/5 p-2 rounded-full hover:bg-white/10 transition-all"><X size={20}/></button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                            
                            {modalType === 'clientProject' && (
                                <div className="space-y-5">
                                    <FormInput label="Project Title" value={forms.clientProject.title} onChange={e=>setForms(p=>({...p, clientProject:{...p.clientProject, title:e.target.value}}))} />
                                    <FormInput label="Client Email (Must Match User Login)" value={forms.clientProject.clientEmail} onChange={e=>setForms(p=>({...p, clientProject:{...p.clientProject, clientEmail:e.target.value}}))} />
                                    <FormTextarea label="Project Description / Brief" value={forms.clientProject.description} onChange={e=>setForms(p=>({...p, clientProject:{...p.clientProject, description:e.target.value}}))} />

                                    <div className="flex gap-4">
                                        <div className="flex-1 space-y-1">
                                            <label className="text-xs text-gray-500 font-bold uppercase ml-1">Status</label>
                                            <select className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none" value={forms.clientProject.status} onChange={e=>setForms(p=>({...p, clientProject:{...p.clientProject, status:e.target.value}}))}>
                                                <option value="Active">Active</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        </div>
                                        <FormInput label="Due Date" value={forms.clientProject.dueDate} onChange={e=>setForms(p=>({...p, clientProject:{...p.clientProject, dueDate:e.target.value}}))} placeholder="YYYY-MM-DD" />
                                    </div>

                                    <div className="flex gap-4">
                                        <FormInput label="Budget (Optional)" value={forms.clientProject.budget} onChange={e=>setForms(p=>({...p, clientProject:{...p.clientProject, budget:e.target.value}}))} placeholder="$5000" />
                                        <div className="flex-1 space-y-1">
                                            <label className="text-xs text-gray-500 font-bold uppercase ml-1">Payment Status</label>
                                            <select className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none" value={forms.clientProject.paymentStatus} onChange={e=>setForms(p=>({...p, clientProject:{...p.clientProject, paymentStatus:e.target.value}}))}>
                                                <option value="Pending">Pending</option>
                                                <option value="Partial">Partial Paid</option>
                                                <option value="Paid">Fully Paid</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500 font-bold uppercase ml-1">Progress: {forms.clientProject.progress}%</label>
                                        <input type="range" min="0" max="100" value={forms.clientProject.progress} onChange={e=>setForms(p=>({...p, clientProject:{...p.clientProject, progress:Number(e.target.value)}}))} className="w-full accent-blue-500 h-2 bg-white/10 rounded-full appearance-none cursor-pointer" />
                                    </div>

                                    <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-sm font-bold text-white flex items-center gap-2"><LinkIcon size={14}/> Resources & Links</h4>
                                            <button type="button" onClick={addProjectLink} className="text-[10px] bg-blue-600 px-2 py-1 rounded text-white hover:bg-blue-700">Add Link</button>
                                        </div>
                                        {forms.clientProject.links.length === 0 && <p className="text-xs text-gray-500 italic">No resources added.</p>}
                                        {forms.clientProject.links.map((link, i) => (
                                            <div key={i} className="flex gap-2 items-center">
                                                <input className="bg-black/40 rounded px-2 py-1 text-xs text-white border border-white/10 flex-1" placeholder="Title (e.g. Figma)" value={link.title} onChange={(e) => {
                                                    const newLinks = [...forms.clientProject.links];
                                                    newLinks[i].title = e.target.value;
                                                    setForms(p => ({...p, clientProject:{...p.clientProject, links: newLinks}}));
                                                }} />
                                                <input className="bg-black/40 rounded px-2 py-1 text-xs text-blue-400 border border-white/10 flex-[2]" placeholder="URL (https://...)" value={link.url} onChange={(e) => {
                                                    const newLinks = [...forms.clientProject.links];
                                                    newLinks[i].url = e.target.value;
                                                    setForms(p => ({...p, clientProject:{...p.clientProject, links: newLinks}}));
                                                }} />
                                                <button type="button" onClick={() => {
                                                    const newLinks = forms.clientProject.links.filter((_, idx) => idx !== i);
                                                    setForms(p => ({...p, clientProject:{...p.clientProject, links: newLinks}}));
                                                }} className="text-red-500"><X size={14}/></button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-sm font-bold text-white flex items-center gap-2"><File size={14}/> Project Documents</h4>
                                            <label className="text-[10px] bg-purple-600 px-2 py-1 rounded text-white hover:bg-purple-700 cursor-pointer flex items-center gap-1">
                                                {uploading ? <Loader2 className="animate-spin" size={10}/> : <UploadCloud size={10}/>} Upload
                                                <input type="file" className="hidden" onChange={handleAdminFileUpload} disabled={uploading} />
                                            </label>
                                        </div>
                                        {forms.clientProject.documents.length === 0 && <p className="text-xs text-gray-500 italic">No documents uploaded.</p>}
                                        <div className="space-y-2">
                                            {forms.clientProject.documents.map((doc, i) => (
                                                <div key={i} className="flex justify-between items-center bg-black/40 p-2 rounded-lg border border-white/5">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <File size={12} className="text-gray-400 shrink-0"/>
                                                        <span className="text-xs text-gray-300 truncate max-w-[150px]">{doc.name}</span>
                                                        <span className="text-[9px] text-gray-600 uppercase border border-white/10 px-1 rounded">{doc.uploadedBy}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <a href={doc.url} target="_blank" className="text-blue-400 hover:text-white"><ExternalLink size={12}/></a>
                                                        <button type="button" onClick={() => {
                                                            const newDocs = forms.clientProject.documents.filter((_, idx) => idx !== i);
                                                            setForms(p => ({...p, clientProject:{...p.clientProject, documents: newDocs}}));
                                                        }} className="text-red-500 hover:text-red-400"><Trash2 size={12}/></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <h4 className="text-sm font-bold text-white flex items-center gap-2"><Layers size={14}/> Stages</h4>
                                        {forms.clientProject.stages.map((stage, i) => (
                                            <div key={i} className="flex gap-2 items-center">
                                                <span className="text-xs text-gray-400 w-6">{i+1}.</span>
                                                <input className="bg-transparent border-b border-white/10 text-xs text-white w-full focus:border-blue-500 outline-none pb-1" value={stage.title} onChange={(e) => {
                                                    const newStages = [...forms.clientProject.stages];
                                                    newStages[i].title = e.target.value;
                                                    setForms(p => ({...p, clientProject:{...p.clientProject, stages: newStages}}));
                                                }} />
                                                <select className="bg-black/50 text-[10px] rounded px-1 py-1 text-gray-400 outline-none border border-white/10" value={stage.status} onChange={(e) => {
                                                    const newStages = [...forms.clientProject.stages];
                                                    newStages[i].status = e.target.value;
                                                    setForms(p => ({...p, clientProject:{...p.clientProject, stages: newStages}}));
                                                }}>
                                                    <option value="pending">Pending</option>
                                                    <option value="completed">Done</option>
                                                </select>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-sm font-bold text-white flex items-center gap-2"><Rss size={14}/> Recent Updates</h4>
                                            <button type="button" onClick={addProjectUpdate} className="text-[10px] bg-blue-600 px-2 py-1 rounded text-white hover:bg-blue-700">Add Update</button>
                                        </div>
                                        {forms.clientProject.updates.length === 0 && <p className="text-xs text-gray-500 italic">No updates added.</p>}
                                        {forms.clientProject.updates.map((update, i) => (
                                            <div key={i} className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-2">
                                                <input className="w-full bg-transparent text-xs font-bold text-white outline-none border-b border-white/5 pb-1" placeholder="Update Title" value={update.title} onChange={(e) => {
                                                    const newUpdates = [...forms.clientProject.updates];
                                                    newUpdates[i].title = e.target.value;
                                                    setForms(p => ({...p, clientProject:{...p.clientProject, updates: newUpdates}}));
                                                }}/>
                                                <textarea className="w-full bg-transparent text-[10px] text-gray-400 outline-none resize-none" placeholder="Description..." value={update.desc} onChange={(e) => {
                                                    const newUpdates = [...forms.clientProject.updates];
                                                    newUpdates[i].desc = e.target.value;
                                                    setForms(p => ({...p, clientProject:{...p.clientProject, updates: newUpdates}}));
                                                }}/>
                                                <button type="button" onClick={() => {
                                                    const newUpdates = forms.clientProject.updates.filter((_, idx) => idx !== i);
                                                    setForms(p => ({...p, clientProject:{...p.clientProject, updates: newUpdates}}));
                                                }} className="text-[10px] text-red-500 hover:underline">Remove</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {modalType === 'blog' && (
                                <div className="space-y-4">
                                    <div className="flex gap-2 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                                        <div className="flex-1">
                                            <label className="text-xs text-blue-400 font-bold uppercase tracking-wider ml-1 mb-1 block">Magic Fill</label>
                                            <input className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-blue-500 placeholder:text-gray-600" placeholder="Paste YouTube/Insta Link..." value={forms.blog.link} onChange={e=>setForms(p=>({...p, blog:{...p.blog, link:e.target.value}}))} />
                                        </div>
                                        <button type="button" onClick={handleExtractMeta} disabled={extracting} className="mt-5 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center">
                                            {extracting ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
                                        </button>
                                    </div>
                                    <FormInput label="Title" value={forms.blog.title} onChange={e=>setForms(p=>({...p, blog:{...p.blog, title:e.target.value}}))} />
                                    <FormInput label="Image URL" value={forms.blog.image} onChange={e=>setForms(p=>({...p, blog:{...p.blog, image:e.target.value}}))} preview />
                                    <FormTextarea label="Description" value={forms.blog.desc} onChange={e=>setForms(p=>({...p, blog:{...p.blog, desc:e.target.value}}))} />
                                </div>
                            )}

                            {modalType === 'project' && (
                                <>
                                    <FormInput label="Project Title" value={forms.project.title} onChange={e=>setForms(p=>({...p, project:{...p.project, title:e.target.value}}))} />
                                    <div className="flex gap-4">
                                        <FormInput label="Category" value={forms.project.category} onChange={e=>setForms(p=>({...p, project:{...p.project, category:e.target.value}}))} />
                                        <FormInput label="Link" value={forms.project.link} onChange={e=>setForms(p=>({...p, project:{...p.project, link:e.target.value}}))} />
                                    </div>
                                    <FormInput label="Image URL" value={forms.project.image} onChange={e=>setForms(p=>({...p, project:{...p.project, image:e.target.value}}))} preview />
                                    <FormTextarea label="Tech Stack (comma sep)" value={forms.project.tech} onChange={e=>setForms(p=>({...p, project:{...p.project, tech:e.target.value}}))} />
                                </>
                            )}

                            {modalType === 'service' && (
                                <>
                                    <FormInput label="Service Title" value={forms.service.title} onChange={e=>setForms(p=>({...p, service:{...p.service, title:e.target.value}}))} />
                                    <FormInput label="Icon Name (Lucide)" value={forms.service.icon} onChange={e=>setForms(p=>({...p, service:{...p.service, icon:e.target.value}}))} />
                                    <FormTextarea label="Description" value={forms.service.desc} onChange={e=>setForms(p=>({...p, service:{...p.service, desc:e.target.value}}))} />
                                </>
                            )}

                            {modalType === 'team' && (
                                <>
                                    <div className="flex gap-4">
                                        <FormInput label="Name" value={forms.team.name} onChange={e=>setForms(p=>({...p, team:{...p.team, name:e.target.value}}))} />
                                        <FormInput label="Role" value={forms.team.role} onChange={e=>setForms(p=>({...p, team:{...p.team, role:e.target.value}}))} />
                                    </div>
                                    <FormInput label="Photo URL" value={forms.team.image} onChange={e=>setForms(p=>({...p, team:{...p.team, image:e.target.value}}))} preview />
                                    <FormTextarea label="Bio" value={forms.team.desc} onChange={e=>setForms(p=>({...p, team:{...p.team, desc:e.target.value}}))} />
                                </>
                            )}

                            {modalType === 'pricing' && (
                                <>
                                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10 mb-2">
                                        <span className="text-sm font-bold text-white">Popular Plan?</span>
                                        <button type="button" onClick={() => setForms(p => ({...p, pricing: {...p.pricing, popular: !p.pricing.popular}}))} className={`w-12 h-6 rounded-full p-1 transition-colors ${forms.pricing.popular ? 'bg-blue-600' : 'bg-gray-700'}`}>
                                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${forms.pricing.popular ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </button>
                                    </div>
                                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">{gradientOptions.map((g) => (<button key={g.name} type="button" onClick={() => setForms(p => ({...p, pricing: {...p.pricing, gradient: g.class}}))} className={`w-8 h-8 rounded-full bg-gradient-to-br ${g.class} ring-2 ring-offset-2 ring-offset-black transition-all ${forms.pricing.gradient === g.class ? 'ring-white scale-110' : 'ring-transparent opacity-70 hover:opacity-100'}`} title={g.name} />))}</div>
                                    <FormInput label="Plan Name" value={forms.pricing.name} onChange={e=>setForms(p=>({...p, pricing:{...p.pricing, name:e.target.value}}))} />
                                    <FormTextarea label="Short Description" value={forms.pricing.desc} onChange={e=>setForms(p=>({...p, pricing:{...p.pricing, desc:e.target.value}}))} />
                                    <div className="flex gap-4">
                                        <FormInput label="Monthly Price ($)" value={forms.pricing.priceMonthly} onChange={e=>setForms(p=>({...p, pricing:{...p.pricing, priceMonthly:e.target.value}}))} />
                                        <FormInput label="Yearly Price ($)" value={forms.pricing.priceYearly} onChange={e=>setForms(p=>({...p, pricing:{...p.pricing, priceYearly:e.target.value}}))} />
                                    </div>
                                    <FormTextarea label="Features (Comma separated)" value={forms.pricing.features} onChange={e=>setForms(p=>({...p, pricing:{...p.pricing, features:e.target.value}}))} />
                                    <FormTextarea label="Missing Features (Comma separated)" value={forms.pricing.missing} onChange={e=>setForms(p=>({...p, pricing:{...p.pricing, missing:e.target.value}}))} />
                                </>
                            )}

                            {modalType === 'review' && (
                                <>
                                    <div className="flex gap-4">
                                        <FormInput label="Client Name" value={forms.review.name} onChange={e=>setForms(p=>({...p, review:{...p.review, name:e.target.value}}))} />
                                        <FormInput label="Role/Designation" value={forms.review.role} onChange={e=>setForms(p=>({...p, review:{...p.review, role:e.target.value}}))} />
                                    </div>
                                    <div className="flex gap-4">
                                         <FormInput label="Rating (1-5)" value={forms.review.rating} onChange={e=>setForms(p=>({...p, review:{...p.review, rating:e.target.value}}))} />
                                         <FormInput label="Avatar URL" value={forms.review.image} onChange={e=>setForms(p=>({...p, review:{...p.review, image:e.target.value}}))} preview />
                                    </div>
                                    <FormTextarea label="Feedback" value={forms.review.text} onChange={e=>setForms(p=>({...p, review:{...p.review, text:e.target.value}}))} />
                                </>
                            )}

                            <button disabled={loading} className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all flex justify-center items-center gap-2 mt-6 shadow-lg">
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

// ... (Reusable Components same)
const NavItem = ({ icon: Icon, label, id, active, set, badge }) => (
    <button onClick={() => set(id)} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-sm font-medium group ${active === id ? "bg-white text-black font-bold shadow-lg shadow-white/5" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
        <Icon size={18} className={active === id ? "text-blue-600" : "text-gray-500 group-hover:text-white"} /> 
        {label}
        {badge > 0 && (<span className="ml-auto flex items-center justify-center"><span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75 mr-4"></span><span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md shadow-blue-600/20 relative z-10">{badge}</span></span>)}
    </button>
);

const FormInput = ({ label, value, onChange, preview, placeholder }) => (
    <div className="space-y-1 w-full">
        <label className="text-xs text-gray-500 ml-1 font-bold uppercase tracking-wider">{label}</label>
        <div className="flex gap-4">
            <input className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-all placeholder:text-gray-700" value={value} onChange={onChange} placeholder={placeholder} required />
            {preview && value && (<div className="w-12 h-11 relative rounded-lg overflow-hidden border border-white/20 shrink-0 bg-gray-800"><img src={value} alt="Preview" className="w-full h-full object-cover" /></div>)}
        </div>
    </div>
);

const FormTextarea = ({ label, value, onChange }) => (
    <div className="space-y-1 w-full">
        <label className="text-xs text-gray-500 ml-1 font-bold uppercase tracking-wider">{label}</label>
        <textarea className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-all min-h-[100px] placeholder:text-gray-700 resize-none" value={value} onChange={onChange} required />
    </div>
);