import mongoose from "mongoose";

const ClientProjectSchema = new mongoose.Schema(
  {
    clientEmail: { type: String, required: true },
    title: { type: String, required: true },
    // Naye Advanced Fields
    description: { type: String, default: "" }, // Project Brief
    budget: { type: String, default: "TBD" }, // e.g. "$5000"
    paymentStatus: { type: String, default: "Pending" }, // Paid, Partial, Pending
    links: { 
        type: [{ title: String, url: String }], 
        default: [] 
    }, // Useful links (Figma, Drive, Invoice)
    
    // Purane Fields
    status: { type: String, default: "Active" },
    progress: { type: Number, default: 0 },
    nextMilestone: { type: String, default: "Discovery" },
    dueDate: { type: String, default: "TBD" },
    stages: { 
        type: Array, 
        default: [
            { id: 1, title: "Discovery", status: "pending", date: "Pending" },
            { id: 2, title: "UI/UX Design", status: "pending", date: "Pending" },
            { id: 3, title: "Development", status: "pending", date: "Pending" },
            { id: 4, title: "Testing", status: "pending", date: "Pending" },
            { id: 5, title: "Deployment", status: "pending", date: "Pending" }
        ]
    },
    updates: { type: Array, default: [] } 
  },
  { timestamps: true }
);

export default mongoose.models.ClientProject || mongoose.model("ClientProject", ClientProjectSchema);