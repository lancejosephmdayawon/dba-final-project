// /app/api/admin/appointments/[id]/status/route.js
import { db } from "@/lib/db";

export async function PATCH(req, { params }) {
  const { id } = params;
  const { status } = await req.json();

  if (!["pending","approved","completed","cancelled"].includes(status)) {
    return new Response(JSON.stringify({ message: "Invalid status" }), { status: 400 });
  }

  try {
    await db.query(
      `UPDATE appointments SET status = ?, updated_at = NOW() WHERE id = ?`,
      [status, id]
    );

    return new Response(JSON.stringify({ message: `Appointment marked ${status}` }), { status: 200 });
  } catch (err) {
    console.error("DB error:", err);
    return new Response(JSON.stringify({ message: "Database error" }), { status: 500 });
  }
}
