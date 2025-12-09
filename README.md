Markdown

# DevSamp - Full-Stack Digital Agency Solution 🚀

**DevSamp** is a modern, high-performance website built for Digital Agencies, IT Companies, and Freelancers. It features a complete **Admin CRM** for managing leads and projects, along with a dedicated **Client Dashboard** for tracking progress and billing.

Built with **Next.js 14 (App Router)**, **MongoDB**, and **Tailwind CSS**.

---

## ✨ Key Features

### 🎨 Frontend (User Facing)
- **Modern UI/UX**: Built with Tailwind CSS and Framer Motion for smooth animations.
- **PWA Ready**: Installable as a mobile app.
- **AI Chatbot**: Built-in chatbot to answer basic queries about services and pricing.
- **Service & Portfolio Showcase**: Dynamic sections managed via Admin Panel.
- **Contact Form**: Real-time entry to database + Email notifications.

### 🛠️ Admin Panel (CMS & CRM)
- **Leads Management**: Track inquiries from "New" to "Closed".
- **Project Management**: Create projects for clients, update status, and upload files.
- **CMS**: Add/Edit/Delete Services, Team Members, Pricing Plans, and Blogs.
- **Analytics**: Visual graphs for daily and weekly leads.
- **Magic Blog**: Auto-fetch video details from YouTube links to create blog posts.

### 👤 Client Dashboard
- **Live Progress**: Clients can see their project timeline and current status.
- **File Sharing**: Download contracts, invoices, and upload requirements.
- **Billing System**: View budget, paid amount, and download PDF invoices.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **File Storage**: [Cloudinary](https://cloudinary.com/)
- **Emails**: [Nodemailer](https://nodemailer.com/)
- **PDF Generation**: jsPDF

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URL)

### 2. Clone the Repository
```bash
git clone [https://github.com/yourusername/devsamp.git](https://github.com/yourusername/devsamp.git)
cd devsamp
3. Install Dependencies
Bash

npm install
4. Configure Environment Variables
Create a .env file in the root directory and add the following keys:

Code snippet

# Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/devsamp

# Admin Security (Required to access /admin)
NEXT_PUBLIC_ADMIN_KEY=your_secret_admin_passkey

# Authentication Secret (Any random string)
JWT_SECRET=supersecretkey123

# Cloudinary (For File/Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (For Contact Form & Notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Public URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
5. Run the Development Server
Bash

npm run dev
Open http://localhost:3000 with your browser to see the result.

📂 Project Structure
devsamp/
├── src/
│   ├── app/                 # Next.js App Router Pages
│   │   ├── admin/           # Admin Dashboard Routes
│   │   ├── dashboard/       # Client Dashboard Routes
│   │   ├── api/             # Backend API Routes
│   │   └── ...              # Public Pages (Home, Services, etc.)
│   ├── components/          # Reusable React Components
│   ├── lib/                 # Utility functions (DB connect, Email)
│   ├── models/              # Mongoose Database Models
│   └── sections/            # Landing Page Sections (Hero, About, etc.)
├── public/                  # Static assets (images, icons)
└── ...
🔐 How to Access Admin Panel
Go to /admin in your browser.

It will ask for a Passkey.

Enter the value you set for NEXT_PUBLIC_ADMIN_KEY in your .env file.

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
Distributed under the MIT License. See LICENSE for more information.

Developed with ❤️ by [Your Name]


### Is file me kya khaas hai?
1.  **Professional Structure:** Standard Github format use kiya gaya hai (Features -> Stack -> Install -> Usage).
2.  **Environment Variables Guide:** Maine `.env` waala section clear likha hai kyunki `NEXT_PUBLIC_ADMIN_KEY` aur `CLOUDINARY` keys ke bina yeh project chalega nahi.
3.  **Admin Access Info:** Naye user ko aksar pata nahi chalta ki Admin panel kaise khulega, isliye wo alag se mention kiya hai.

Aap bas `[Your Name]` aur repository URL ko replace kar dena!
