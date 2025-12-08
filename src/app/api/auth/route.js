import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  try {
    const { action, name, email, password } = await request.json();
    await connectDB();

    // --- SIGNUP (नया अकाउंट) ---
    if (action === 'signup') {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ message: "User already exists!" }, { status: 400 });
      }
      const newUser = await User.create({ name, email, password });
      return NextResponse.json({ message: "Account created!", user: newUser }, { status: 201 });
    }

    // --- LOGIN (पुराना अकाउंट) ---
    if (action === 'login') {
      const user = await User.findOne({ email });
      // नोट: प्रोडक्शन में पासवर्ड को bcrypt से हैश करना चाहिए
      if (!user || user.password !== password) { 
        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
      }
      return NextResponse.json({ message: "Login successful!", user }, { status: 200 });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}