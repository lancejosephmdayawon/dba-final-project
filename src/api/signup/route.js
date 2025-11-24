import { db } from "@lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return Response.json({ message: "Username, email, and password are required" }, { status: 400 });
    }

    // Check if username already taken
    const [existingUsername] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (existingUsername.length > 0) {
      return Response.json({ message: "Username is already taken" }, { status: 400 });
    }
    // Check if email already registered
    const [existingEmail] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingEmail.length > 0) {
      return Response.json({ message: "Email already registered" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    await db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [
        username,
        email,
        hashedPassword,
    ]);

    return Response.json({ message: "User created successfully" }, { status: 201 });

  } catch (error) {
    console.error(error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
