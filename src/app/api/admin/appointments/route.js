// /app/api/admin/appointments/route.js
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        a.id,
        a.patient_id,
        CONCAT_WS(' ', u.first_name, u.middle_name, u.last_name) AS patient_name,
        p.contact_number,
        s.name AS service_name,
        s.duration_minutes,
        s.price,
        a.appointment_date,
        a.start_time,
        a.end_time,
        a.status,
        a.notes
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN services s ON a.service_id = s.id
      ORDER BY a.appointment_date ASC, a.start_time ASC
    `);

    console.log("Fetched appointments:", rows); // debug
    return new Response(JSON.stringify({ appointments: rows }), { status: 200 });
  } catch (err) {
    console.error("DB error:", err);
    return new Response(JSON.stringify({ message: "Database error" }), { status: 500 });
  }
}
