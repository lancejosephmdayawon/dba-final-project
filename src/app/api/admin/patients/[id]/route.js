// src/app/api/admin/patients/[id]/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { db } from "@/lib/db";

// PUT to update patient details
export async function PUT(req, context) {
  const params = await context.params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await req.json();

  // Safe defaults for optional fields
  const firstName = body.first_name || "";
  const lastName = body.last_name || "";
  const email = body.email || "";
  const contactNumber = body.contact_number || "";
  const genderValue = ["male", "female", "other"].includes(body.gender) ? body.gender : "other";
  const birthdateValue = body.birthdate || null;

  // Update users
  await db.query(
    `UPDATE users SET first_name=?, last_name=?, email=? WHERE id=?`,
    [firstName, lastName, email, params.id]
  );

  // Update patients
  await db.query(
    `UPDATE patients SET contact_number=?, gender=?, birthdate=? WHERE user_id=?`,
    [contactNumber, genderValue, birthdateValue, params.id]
  );

  return new Response(JSON.stringify({ success: true }));
}

// PATCH to verify or unverify patient email
export async function PATCH(req, context) {
  const params = await context.params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  // Parse request body
  const { verified } = await req.json();
  // Update email_verified status
  await db.query(
    `UPDATE users SET email_verified=? WHERE id=?`,
    [verified ? 1 : 0, params.id]
  );

  return new Response(JSON.stringify({ success: true }));
}
