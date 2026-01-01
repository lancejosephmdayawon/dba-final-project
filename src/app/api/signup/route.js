import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return Response.json({ message: "All fields are required" }, { status: 400 });
    }

    // Check if username exists
    const [existingUsername] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (existingUsername.length > 0) {
      return Response.json({ message: "Username already taken" }, { status: 400 });
    }

    // Check if email exists
    const [existingEmail] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingEmail.length > 0) {
      return Response.json({ message: "Email already registered" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.query("CALL createUser(?, ?, ?)", [username, email, hashedPassword]);

    return Response.json({ message: "User created successfully" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
