import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { action, name, email, password, provider } = await request.json();
    await connectDB();

    // --- 1. SIGNUP (नया अकाउंट) ---
    if (action === 'signup') {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ message: "User already exists!" }, { status: 400 });
      }
      const newUser = await User.create({ name, email, password, provider: "email" });
      return NextResponse.json({ message: "Account created!", user: newUser }, { status: 201 });
    }

    // --- 2. LOGIN (पुराना अकाउंट) ---
    if (action === 'login') {
      const user = await User.findOne({ email });
      if (!user || user.password !== password) { 
        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
      }
      return NextResponse.json({ message: "Login successful!", user }, { status: 200 });
    }

    // --- 3. FORGOT PASSWORD (नया फीचर) ---
    if (action === 'forgot') {
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ message: "No user found with this email" }, { status: 404 });
      }

      // Nodemailer Setup (Real email sending)
      // नोट: .env फाइल में EMAIL_USER और EMAIL_PASS सेट करें
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'demo@devsamp.com', 
          pass: process.env.EMAIL_PASS || 'demo1234'
        }
      });

      // Email Content
      const mailOptions = {
        from: 'DevSamp Security <security@devsamp.com>',
        to: email,
        subject: 'Password Reset Request',
        text: `Hello ${user.name},\n\nWe received a request to reset your password. Since this is a demo, your current password is: ${user.password}\n\nRegards,\nDevSamp Team`
      };

      try {
        // अगर env vars सेट हैं तो ईमेल भेजें, वरना console में दिखाएं
        if (process.env.EMAIL_USER) {
            await transporter.sendMail(mailOptions);
        } else {
            console.log(`[DEMO EMAIL] To: ${email}, Password: ${user.password}`);
        }
        return NextResponse.json({ message: "Reset link sent to your email!" }, { status: 200 });
      } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to send email. Try again." }, { status: 500 });
      }
    }

    // --- 4. SOCIAL LOGIN (Google/GitHub Simulation) ---
    if (action === 'social') {
        // चेक करें अगर यूजर पहले से है
        let user = await User.findOne({ email });
        
        if (!user) {
            // अगर नहीं है, तो नया बनाएं (Random Password के साथ)
            user = await User.create({ 
                name, 
                email, 
                password: Math.random().toString(36).slice(-8), 
                role: 'client',
                provider: provider // google या github
            });
        }
        
        return NextResponse.json({ message: `Welcome ${name}!`, user }, { status: 200 });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}