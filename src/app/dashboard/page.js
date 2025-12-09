"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LogOut, Home, FolderOpen, User, Settings, FileText, 
  CheckCircle2, Clock, AlertCircle, ChevronRight, 
  ExternalLink, Download, CreditCard, Layout, Code2, Rocket, Loader2, DollarSign, Link as LinkIcon,
  UploadCloud, File // <-- New Icons Imported
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); 
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // --- New State for Upload ---
  const [uploading, setUploading] = useState(false);

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

  // --- New File Upload Function ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
        // 1. Cloudinary Upload
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData
        });
        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) throw new Error("Upload Failed");

        // 2. Database Update
        const newDoc = {
            name: file.name,
            url: uploadData.url,
            uploadedBy: "Client",
            date: new Date().toLocaleDateString()
        };

        const updatedDocs = [newDoc, ...(projectData.documents || [])];

        const updateRes = await fetch("/api/client-projects", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                id: projectData._id, 
                documents: updatedDocs 
            })
        });

        if (updateRes.ok) {
            setProjectData({ ...projectData, documents: updatedDocs });
            alert("File Uploaded Successfully!");
        }

    } catch (error) {
        console.error(error);
        alert("Failed to upload file.");
    }
    setUploading(false);
  };

  // --- Invoice Logic (Same as before) ---
  const generateInvoice = () => {
    if (!projectData) return;

    const doc = new jsPDF();
    const brandColor = [37, 99, 235]; 

    // Header
    doc.setFontSize(24);
    doc.setTextColor(...brandColor);
    doc.setFont("helvetica", "bold");
    doc.text("DEVSAMP", 15, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text("Digital Product Agency", 15, 26);

    // Invoice Label
    doc.setFontSize(30);
    doc.setTextColor(200, 200, 200);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 150, 25);

    // Divider
    doc.setDrawColor(200);
    doc.line(15, 35, 195, 35);

    // Info
    doc.setFontSize(10);
    doc.setTextColor(50);

    doc.setFont("helvetica", "bold");
    doc.text("FROM:", 15, 45);
    doc.setFont("helvetica", "normal");
    doc.text("DevSamp Agency", 15, 50);
    doc.text("Kolkata, West Bengal, India", 15, 55);
    doc.text("Email: devsamp1st@gmail.com", 15, 60);

    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 110, 45);
    doc.setFont("helvetica", "normal");
    doc.text(user.name, 110, 50);
    doc.text(user.email, 110, 55);
    doc.text(`Project: ${projectData.title}`, 110, 60);

    // Table
    const tableColumn = ["Description", "Phase", "Cost"];
    const tableRows = [
        [projectData.title, "Full Project", projectData.budget || "$0"]
    ];

    autoTable(doc, {
        startY: 105,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: brandColor }
    });

    doc.save(`Invoice_${projectData.title}.pdf`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white flex pt-28">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="w-64 border-r border-white/10 hidden md:flex flex-col fixed left-0 top-28 bottom-0 bg-black z-10 overflow-y-auto custom-scrollbar">
        <div className="p-6 flex-1 space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-4">Main Menu</p>
            <NavItem icon={Home} label="Overview" id="overview" active={activeTab} set={setActiveTab} />
            <NavItem icon={FolderOpen} label="My Project" id="project" active={activeTab} set={setActiveTab} />
            
            {/* New Documents Tab */}
            <NavItem icon={FileText} label="Documents" id="documents" active={activeTab} set={setActiveTab} />
            
            <NavItem icon={CreditCard} label="Billing" id="billing" active={activeTab} set={setActiveTab} />
            <NavItem icon={Layout} label="Resources" id="resources" active={activeTab} set={setActiveTab} />
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

      {/* Mobile Nav Tabs */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0a0a0a] border-t border-white/10 p-3 z-50 flex justify-around items-center">
         <button onClick={() => setActiveTab('overview')} className={`p-2 rounded-lg ${activeTab === 'overview' ? 'text-blue-500 bg-white/10' : 'text-gray-500'}`}><Home size={20}/></button>
         <button onClick={() => setActiveTab('project')} className={`p-2 rounded-lg ${activeTab === 'project' ? 'text-blue-500 bg-white/10' : 'text-gray-500'}`}><FolderOpen size={20}/></button>
         
         {/* New Mobile Documents Button */}
         <button onClick={() => setActiveTab('documents')} className={`p-2 rounded-lg ${activeTab === 'documents' ? 'text-blue-500 bg-white/10' : 'text-gray-500'}`}><FileText size={20}/></button>
         
         <button onClick={() => setActiveTab('billing')} className={`p-2 rounded-lg ${activeTab === 'billing' ? 'text-blue-500 bg-white/10' : 'text-gray-500'}`}><CreditCard size={20}/></button>
         <button onClick={handleLogout} className="p-2 text-red-500 rounded-lg"><LogOut size={20}/></button>
      </div>

      <main className="flex-1 p-6 md:p-10 md:ml-64 w-full max-w-7xl mx-auto pb-24 md:pb-10">
        <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {activeTab === 'overview' && `Welcome back, ${user.name.split(' ')[0]} 👋`}
                {activeTab === 'project' && "Project Dashboard"}
                {activeTab === 'documents' && "File Manager"} 
                {activeTab === 'billing' && "Billing & Invoices"}
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
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <StatCard label="Status" value={projectData.status} icon={<FolderOpen className="text-blue-500" size={24}/>} sub="Current State"/>
                                <StatCard label="Payment" value={projectData.paymentStatus} icon={<DollarSign className={projectData.paymentStatus === 'Paid' ? "text-green-500" : "text-yellow-500"} size={24}/>} sub={projectData.budget || "TBD"}/>
                                <StatCard label="Next Milestone" value={projectData.nextMilestone} icon={<Code2 className="text-purple-500" size={24}/>} sub={`${projectData.progress}% Done`}/>
                                <StatCard label="Due Date" value={projectData.dueDate} icon={<Clock className="text-orange-500" size={24}/>} sub="Estimated"/>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                                <div className="space-y-6">
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
                                </div>
                            </div>
                        </>
                    )}

                    {/* PROJECT TAB */}
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

                    {/* --- DOCUMENTS TAB (NEW FEATURE) --- */}
                    {activeTab === 'documents' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Upload Area */}
                            <div className="lg:col-span-1">
                                <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl h-full flex flex-col">
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <UploadCloud size={20} className="text-blue-500"/> Upload Files
                                    </h3>
                                    <p className="text-sm text-gray-400 mb-6">
                                        Share logos, brand assets, or signed contracts securely.
                                    </p>
                                    
                                    <label className="flex-1 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-blue-500/50 hover:bg-white/5 transition-all group">
                                        <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                                        {uploading ? (
                                            <Loader2 size={32} className="text-blue-500 animate-spin mb-3" />
                                        ) : (
                                            <div className="p-4 bg-white/5 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                                <UploadCloud size={24} className="text-gray-400 group-hover:text-white" />
                                            </div>
                                        )}
                                        <p className="text-sm font-bold text-gray-300">
                                            {uploading ? "Uploading..." : "Click to Upload"}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">Max size 5MB (Images, PDF)</p>
                                    </label>
                                </div>
                            </div>

                            {/* Files List */}
                            <div className="lg:col-span-2">
                                <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl min-h-[400px]">
                                    <h3 className="text-xl font-bold mb-6 flex items-center justify-between">
                                        <span>Shared Documents</span>
                                        <span className="text-xs font-normal text-gray-500 bg-white/5 px-2 py-1 rounded">
                                            {projectData.documents?.length || 0} Files
                                        </span>
                                    </h3>

                                    <div className="space-y-3">
                                        {projectData.documents && projectData.documents.length > 0 ? (
                                            projectData.documents.map((doc, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-3 rounded-xl ${doc.uploadedBy === 'Admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                            <File size={20} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-white mb-0.5 line-clamp-1">{doc.name}</h4>
                                                            <div className="flex gap-2 text-[10px] text-gray-500">
                                                                <span className="uppercase tracking-wider font-bold">{doc.uploadedBy}</span>
                                                                <span>•</span>
                                                                <span>{doc.date}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <a href={doc.url} target="_blank" download className="p-2 bg-black hover:bg-white text-gray-400 hover:text-black rounded-lg transition-colors" title="Download">
                                                            <Download size={16} />
                                                        </a>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-20">
                                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <FolderOpen size={24} className="text-gray-600" />
                                                </div>
                                                <p className="text-gray-500">No documents shared yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BILLING TAB */}
                    {activeTab === 'billing' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
                                <div className="absolute top-0 right-0 p-32 bg-blue-600/5 blur-3xl rounded-full pointer-events-none"></div>
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Budget</p>
                                        <h3 className="text-4xl font-bold text-white">{projectData.budget || "TBD"}</h3>
                                    </div>
                                    <div className={`px-4 py-2 rounded-full text-sm font-bold border ${projectData.paymentStatus === 'Paid' ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"}`}>
                                        {projectData.paymentStatus}
                                    </div>
                                </div>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-3"><span className="text-gray-400">Invoice ID</span><span className="font-mono text-white">#INV-{Math.floor(Math.random() * 10000)}</span></div>
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-3"><span className="text-gray-400">Date Issued</span><span className="text-white">{new Date().toLocaleDateString()}</span></div>
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-3"><span className="text-gray-400">Project</span><span className="text-white text-right truncate max-w-[150px]">{projectData.title}</span></div>
                                </div>
                                <button onClick={generateInvoice} className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all shadow-lg hover:shadow-white/10"><Download size={20} /> Download Professional Invoice</button>
                            </div>
                            <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><CreditCard size={20} className="text-blue-500"/> Payment Methods</h3>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5 mb-4"><p className="text-sm text-gray-300 mb-1">Bank Transfer (UPI/NEFT)</p><p className="text-xs text-gray-500 font-mono">9330680642@upi</p></div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5"><p className="text-sm text-gray-300 mb-1">International Payments</p><p className="text-xs text-gray-500">Contact admin for PayPal/Wise link.</p></div>
                                <p className="text-xs text-gray-600 mt-6 italic">* Please share the transaction screenshot after payment.</p>
                            </div>
                        </div>
                    )}

                    {/* RESOURCES TAB */}
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

// Reusable Components
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