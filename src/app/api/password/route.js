import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";
import bcrypt from "bcryptjs";

// PATCH to update user password
export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = session.user.id;
    const { oldPassword, newPassword } = await req.json();

    // Validate input
    if (!oldPassword || !newPassword) {
      return new Response(
        JSON.stringify({ error: "Old and new password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch hashed password from DB
    const [[user]] = await db.execute(
      "SELECT password FROM users WHERE id = ?",
      [userId]
    );

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Compare old password with hashed password
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      return new Response(
        JSON.stringify({ error: "Old password is incorrect" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hash new password and update DB
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.execute("UPDATE users SET password=? WHERE id=?", [hashed, userId]);

    // Success response
    return new Response(
      JSON.stringify({ message: "Password updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to update password" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
