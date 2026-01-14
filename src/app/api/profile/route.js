import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";

// GET to fetch user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = session.user.id;

    // Fetch user and patient details
    const [userRows] = await db.execute(
      "SELECT id, username, first_name, middle_name, last_name, email FROM users WHERE id = ?",
      [userId]
    );

    // If no user found
    const [patientRows] = await db.execute(
      "SELECT id, contact_number, address, birthdate, gender FROM patients WHERE user_id = ?",
      [userId]
    );

    // If no patient found
    return new Response(
      JSON.stringify({ user: userRows[0], patient: patientRows[0] }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch profile" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

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
    const body = await req.json();

    const {
      first_name,
      middle_name,
      last_name,
      email,
      contact_number,
      address,
      birthdate,
      gender,
    } = body;

    // Update user
    await db.execute(
      "UPDATE users SET first_name=?, middle_name=?, last_name=?, email=? WHERE id=?",
      [first_name, middle_name, last_name, email, userId]
    );

    // Update patient
    await db.execute(
      "UPDATE patients SET contact_number=?, address=?, birthdate=?, gender=? WHERE user_id=?",
      [contact_number, address, birthdate, gender, userId]
    );

    return new Response(
      JSON.stringify({ message: "Profile updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to update profile" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
