import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ClientProject from '@/models/ClientProject';
import { sendEmail } from '@/lib/email'; // <-- Import Helper

// 1. GET
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    await connectDB();
    
    let projects;
    if (email) {
        projects = await ClientProject.findOne({ clientEmail: email });
    } else {
        projects = await ClientProject.find().sort({ createdAt: -1 });
    }

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching projects" }, { status: 500 });
  }
}

// 2. POST
export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();
    await ClientProject.create(body);
    
    // New Project Notification to Client
    await sendEmail(
        body.clientEmail,
        "Welcome to DevSamp Dashboard!",
        `Hi,\n\nYour project "${body.title}" has been created. You can now login to view progress.`
    );

    return NextResponse.json({ message: "Client Project Created!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating project" }, { status: 500 });
  }
}

// 3. PUT (Update Status & Notify)
export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();
    await connectDB();

    // Pehle purana project fetch karo email lene ke liye
    const existingProject = await ClientProject.findById(id);

    // Update Project
    await ClientProject.findByIdAndUpdate(id, data);

    // --- EMAIL LOGIC ---
    if (existingProject && data.status && data.status !== existingProject.status) {
        // Agar Status change hua hai
        await sendEmail(
            existingProject.clientEmail,
            `Project Update: ${existingProject.title}`,
            `Hi,\n\nYour project status has been updated to: ${data.status}.\n\nCheck your dashboard for details.`
        );
    }
    
    if (existingProject && data.progress && data.progress === 100 && existingProject.progress !== 100) {
        // Agar Project 100% complete hua hai
        await sendEmail(
            existingProject.clientEmail,
            `🎉 Project Completed: ${existingProject.title}`,
            `Congratulations! Your project "${existingProject.title}" is fully completed.\n\nPlease review everything on your dashboard.`
        );
    }
    // -------------------

    return NextResponse.json({ message: "Project Updated Successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating project" }, { status: 500 });
  }
}

// 4. DELETE
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await connectDB();
    await ClientProject.findByIdAndDelete(id);
    return NextResponse.json({ message: "Project Deleted!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting project" }, { status: 500 });
  }
}