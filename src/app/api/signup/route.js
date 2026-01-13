import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Check if username exists
    const [existingUsername] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (existingUsername.length > 0) {
      return NextResponse.json({ message: "Username already taken" }, { status: 400 });
    }

    // Check if email exists
    const [existingEmail] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingEmail.length > 0) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user using stored procedure
    await db.query("CALL createUser(?, ?, ?)", [username, email, hashedPassword]);

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
