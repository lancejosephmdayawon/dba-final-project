// src/app/api/admin/patients/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// GET all patients
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

// Fetch patient list with details and latest completed appointment date 
  const [rows] = await db.query(`
    SELECT 
      u.id AS user_id,
      p.id AS patient_id,
      u.username,
      u.first_name,
      u.last_name,
      u.email,
      u.email_verified,
      p.contact_number,
      p.gender,
      p.birthdate,
      FLOOR(DATEDIFF(CURDATE(), p.birthdate)/365) AS age,
      (SELECT appointment_date 
       FROM appointments 
       WHERE patient_id = p.id AND status='completed' 
       ORDER BY appointment_date DESC LIMIT 1) AS latest_completed
    FROM users u
    JOIN patients p ON p.user_id = u.id
    WHERE u.role='patient'
    ORDER BY p.created_at DESC
  `);

  return new Response(JSON.stringify(rows));
}

// POST create new patient
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const {
    username,
    email,
    password,
    first_name = "",
    last_name = "",
    contact_number = "",
    gender = "",
    birthdate = ""
  } = await req.json();

  // Only username and email are required
  if (!username || !email) {
    return new Response(JSON.stringify({ error: "Username and email are required" }), { status: 400 });
  }

  // Validate gender, default to 'other' if blank or invalid
  const allowedGenders = ["male", "female", "other"];
  const genderValue = allowedGenders.includes(gender) ? gender : "other";

  // Convert empty birthdate to null
  const birthdateValue = birthdate ? birthdate : null;

  try {
    // 1️⃣ Check if user exists
    const [existingUsers] = await db.query(
      `SELECT id FROM users WHERE username = ? OR email = ?`,
      [username, email]
    );

    let userId;
    let tempPassword = null;

    if (existingUsers.length > 0) {
      userId = existingUsers[0].id;

      // 2️⃣ Existing user → check if patient exists
      const [existingPatient] = await db.query(
        `SELECT id FROM patients WHERE user_id = ?`,
        [userId]
      );
      if (existingPatient.length > 0) {
        return new Response(
          JSON.stringify({ error: "Patient already exists for this user" }),
          { status: 400 }
        );
      }
    } else {
      // 3️⃣ New user → insert
      tempPassword = password || Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      // Insert into users table
      const [userResult] = await db.query(
        `INSERT INTO users (username,email,password,role,email_verified,first_name,last_name)
         VALUES (?, ?, ?, 'patient', 0, ?, ?)`,
        [username, email, hashedPassword, first_name, last_name]
      );

      userId = userResult.insertId;
    }

    // Update patient row created by trigger with optional info
    await db.query(
      `UPDATE patients
       SET contact_number = ?, gender = ?, birthdate = ?, updated_at = NOW()
       WHERE user_id = ?`,
      [contact_number || "", genderValue, birthdateValue, userId]
    );

    return new Response(
      JSON.stringify({
        success: true,
        ...(tempPassword ? { tempPassword } : {}),
      })
    );

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Server error: " + err.message }),
      { status: 500 }
    );
  }
}
