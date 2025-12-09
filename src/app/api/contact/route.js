import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contact from '@/models/Contact';
import { sendEmail } from '@/lib/email'; // <-- Import Helper

// 1. DATA SAVE KARNA (POST)
export async function POST(request) {
  try {
    const { name, email, service, message } = await request.json();
    
    console.log("📨 New Lead Received:", name);

    await connectDB();
    
    // Database me save karo
    await Contact.create({ 
        name, 
        email, 
        service, 
        message,
        status: "New"
    });

    // --- EMAIL NOTIFICATION LOGIC (NEW) ---
    // 1. Admin ko email bhejo
    const adminEmailContent = `
      <h3>🚀 New Lead Received!</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `;
    
    await sendEmail(
        process.env.EMAIL_USER, // Admin Email (Apna hi email daalein)
        `New Inquiry from ${name}`,
        `New lead from ${name} for ${service}.`,
        adminEmailContent
    );

    // 2. Client ko "Thank You" email bhejo (Optional but professional)
    await sendEmail(
        email,
        "We received your message! - DevSamp",
        `Hi ${name},\n\nThanks for reaching out. We have received your inquiry regarding ${service} and will get back to you shortly.\n\nBest,\nDevSamp Team`
    );
    // --------------------------------------

    return NextResponse.json(
      { message: "Message Saved & Email Sent!" }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("Save Error:", error);
    return NextResponse.json(
      { message: "Failed to save message" }, 
      { status: 500 }
    );
  }
}

// 2. DATA LANA (GET)
export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json({ contacts }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch contacts" }, { status: 500 });
  }
}

// 3. DELETE
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await connectDB();
    await Contact.findByIdAndDelete(id);
    return NextResponse.json({ message: "Lead Deleted!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 });
  }
}

// 4. UPDATE STATUS
export async function PUT(request) {
  try {
    const { id, status } = await request.json();
    await connectDB();
    await Contact.findByIdAndUpdate(id, { status });
    return NextResponse.json({ message: "Status Updated!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update status" }, { status: 500 });
  }
}