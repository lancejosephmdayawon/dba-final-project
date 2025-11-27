import { db } from "@lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Check required fields
    if (!email || !password) {
      return Response.json({ message: "Email and password are required" }, { status: 400 });
    }

    // Find user by email using stored procedure
    const [resultSets] = await db.query("CALL searchUser(?)", [email]);

    // Extract actual rows
    const rows = resultSets[0];
    
    if (rows.length === 0) {
      return Response.json({ message: "Invalid email or password" }, { status: 400 });
    }

    const user = rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ message: "Invalid email or password" }, { status: 400 });
    }

    // Success — return user info (without password!)
    return Response.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
