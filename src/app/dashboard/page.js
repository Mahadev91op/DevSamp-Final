"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LogOut, Home, FolderOpen, User, Settings, FileText, 
  CheckCircle2, Clock, AlertCircle, ChevronRight, 
  ExternalLink, Download, CreditCard, Layout, Code2, Rocket, Loader2, DollarSign, Link as LinkIcon
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  // --- ADVANCED PDF GENERATION LOGIC ---
  const generateInvoice = () => {
    if (!projectData) return;

    const doc = new jsPDF();
    const brandColor = [37, 99, 235]; // Blue-600 RGB

    // --- 1. HEADER & BRANDING ---
    // Left Side Logo & Name
    doc.setFontSize(24);
    doc.setTextColor(...brandColor);
    doc.setFont("helvetica", "bold");
    doc.text("DEVSAMP", 15, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text("Digital Product Agency", 15, 26);

    // Right Side: INVOICE Label
    doc.setFontSize(30);
    doc.setTextColor(200, 200, 200); // Light Gray
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 150, 25);

    // Divider Line
    doc.setDrawColor(200);
    doc.line(15, 35, 195, 35);

    // --- 2. COMPANY & CLIENT INFO ---
    doc.setFontSize(10);
    doc.setTextColor(50);

    // FROM (Company)
    doc.setFont("helvetica", "bold");
    doc.text("FROM:", 15, 45);
    doc.setFont("helvetica", "normal");
    doc.text("DevSamp Agency", 15, 50);
    doc.text("Kolkata, West Bengal, India", 15, 55);
    doc.text("Email: devsamp1st@gmail.com", 15, 60);
    doc.text("Phone: +91 9330680642", 15, 65);

    // TO (Client)
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 110, 45);
    doc.setFont("helvetica", "normal");
    doc.text(user.name, 110, 50);
    doc.text(user.email, 110, 55);
    doc.text(`Project: ${projectData.title}`, 110, 60);

    // Invoice Meta Data
    const invoiceNo = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    const issueDate = new Date().toLocaleDateString();
    const dueDate = projectData.dueDate || "Upon Receipt";

    doc.setFillColor(245, 247, 250);
    doc.roundedRect(15, 75, 180, 20, 2, 2, "F");
    
    doc.setFont("helvetica", "bold");
    doc.text(`Invoice No: ${invoiceNo}`, 20, 85);
    doc.text(`Issue Date: ${issueDate}`, 80, 85);
    doc.text(`Due Date: ${dueDate}`, 140, 85);

    // --- 3. ITEMS TABLE ---
    const tableColumn = ["Description", "Milestone Phase", "Cost"];
    const tableRows = [
        [projectData.title, "Discovery & Strategy", "Included"],
        [projectData.description || "Web Development Services", projectData.nextMilestone, projectData.budget || "$0"]
    ];

    autoTable(doc, {
        startY: 105,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { 
            fillColor: brandColor, 
            textColor: [255, 255, 255], 
            fontStyle: 'bold',
            halign: 'left'
        },
        styles: { 
            fontSize: 10, 
            cellPadding: 6,
            textColor: [50, 50, 50]
        },
        columnStyles: {
            0: { cellWidth: 80 },
            1: { cellWidth: 60 },
            2: { cellWidth: 40, halign: 'right', fontStyle: 'bold' },
        },
        foot: [['', 'Total', projectData.budget || "$0"]],
        footStyles: {
            fillColor: [240, 240, 240],
            textColor: brandColor,
            fontStyle: 'bold',
            halign: 'right'
        }
    });

    // --- 4. PAYMENT STATUS & INFO ---
    const finalY = doc.lastAutoTable.finalY + 15;
    
    // Payment Status Badge
    const status = projectData.paymentStatus || "Pending";
    if (status === "Paid") {
        doc.setTextColor(34, 197, 94); // Green
        doc.setFontSize(14);
        doc.text("PAID IN FULL", 15, finalY + 5);
    } else {
        doc.setTextColor(239, 68, 68); // Red
        doc.setFontSize(14);
        doc.text("PAYMENT PENDING", 15, finalY + 5);
    }

    // Bank Details Box
    doc.setDrawColor(220);
    doc.setLineWidth(0.5);
    doc.rect(15, finalY + 15, 90, 35);
    
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Bank Transfer Details:", 20, finalY + 22);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80);
    doc.text("Bank: HDFC Bank", 20, finalY + 28);
    doc.text("Account Name: DevSamp Agency", 20, finalY + 33);
    doc.text("Account No: XXXXXXXXXX1234", 20, finalY + 38);
    doc.text("IFSC Code: HDFC0001234", 20, finalY + 43);

    // --- 5. TERMS & FOOTER ---
    const pageHeight = doc.internal.pageSize.height;
    
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Terms & Conditions:", 15, pageHeight - 30);
    doc.text("1. Please pay within 7 days of receiving this invoice.", 15, pageHeight - 25);
    doc.text("2. This is a computer-generated invoice and requires no signature.", 15, pageHeight - 21);

    // Bottom Line
    doc.setFillColor(...brandColor);
    doc.rect(0, pageHeight - 10, 210, 10, "F");
    
    doc.setTextColor(255);
    doc.text("www.devsamp.com", 15, pageHeight - 4);
    doc.text("Thank you for your business!", 150, pageHeight - 4);

    // Save
    doc.save(`DevSamp_Invoice_${invoiceNo}.pdf`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white flex pt-28">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="w-64 border-r border-white/10 hidden md:flex flex-col fixed left-0 top-28 bottom-0 bg-black z-10 overflow-y-auto">
        <div className="p-6 flex-1 space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-4">Main Menu</p>
            <NavItem icon={Home} label="Overview" id="overview" active={activeTab} set={setActiveTab} />
            <NavItem icon={FolderOpen} label="My Project" id="project" active={activeTab} set={setActiveTab} />
            <NavItem icon={CreditCard} label="Billing" id="billing" active={activeTab} set={setActiveTab} />
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

      {/* Mobile Nav Tabs (Visible only on mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0a0a0a] border-t border-white/10 p-3 z-50 flex justify-around items-center">
         <button onClick={() => setActiveTab('overview')} className={`p-2 rounded-lg ${activeTab === 'overview' ? 'text-blue-500 bg-white/10' : 'text-gray-500'}`}><Home size={20}/></button>
         <button onClick={() => setActiveTab('project')} className={`p-2 rounded-lg ${activeTab === 'project' ? 'text-blue-500 bg-white/10' : 'text-gray-500'}`}><FolderOpen size={20}/></button>
         <button onClick={() => setActiveTab('billing')} className={`p-2 rounded-lg ${activeTab === 'billing' ? 'text-blue-500 bg-white/10' : 'text-gray-500'}`}><CreditCard size={20}/></button>
         <button onClick={handleLogout} className="p-2 text-red-500 rounded-lg"><LogOut size={20}/></button>
      </div>

      <main className="flex-1 p-6 md:p-10 md:ml-64 w-full max-w-7xl mx-auto pb-24 md:pb-10">
        <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {activeTab === 'overview' && `Welcome back, ${user.name.split(' ')[0]} 👋`}
                {activeTab === 'project' && "Project Dashboard"}
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

                    {/* BILLING TAB (NEW & IMPROVED) */}
                    {activeTab === 'billing' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Invoice Card */}
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
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-3">
                                        <span className="text-gray-400">Invoice ID</span>
                                        <span className="font-mono text-white">#INV-{Math.floor(Math.random() * 10000)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-3">
                                        <span className="text-gray-400">Date Issued</span>
                                        <span className="text-white">{new Date().toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-3">
                                        <span className="text-gray-400">Project</span>
                                        <span className="text-white text-right truncate max-w-[150px]">{projectData.title}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={generateInvoice}
                                    className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all shadow-lg hover:shadow-white/10"
                                >
                                    <Download size={20} /> Download Professional Invoice
                                </button>
                            </div>

                            {/* Payment Info Card */}
                            <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><CreditCard size={20} className="text-blue-500"/> Payment Methods</h3>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5 mb-4">
                                    <p className="text-sm text-gray-300 mb-1">Bank Transfer (UPI/NEFT)</p>
                                    <p className="text-xs text-gray-500 font-mono">9330680642@upi</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-sm text-gray-300 mb-1">International Payments</p>
                                    <p className="text-xs text-gray-500">Contact admin for PayPal/Wise link.</p>
                                </div>
                                <p className="text-xs text-gray-600 mt-6 italic">
                                    * Please share the transaction screenshot after payment.
                                </p>
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