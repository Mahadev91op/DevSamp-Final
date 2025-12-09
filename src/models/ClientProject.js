import mongoose from "mongoose";

const ClientProjectSchema = new mongoose.Schema(
  {
    clientEmail: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    budget: { type: String, default: "TBD" },
    paymentStatus: { type: String, default: "Pending" },
    
    links: { 
        type: [{ title: String, url: String }], 
        default: [] 
    },

    // --- NEW: Documents Section ---
    documents: {
        type: [{
            name: String,
            url: String,
            uploadedBy: String, // 'Client' or 'Admin'
            date: String
        }],
        default: []
    },
    // ------------------------------

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