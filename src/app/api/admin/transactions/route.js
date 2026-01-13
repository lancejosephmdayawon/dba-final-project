// src/app/api/admin/transactions/route.js
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        pay.id AS payment_id,
        pay.amount,
        pay.payment_method,
        pay.status AS payment_status,
        pay.paid_at,
        a.id AS appointment_id,
        a.appointment_date,
        a.start_time,
        a.end_time,
        a.status AS appointment_status,
        a.notes,
        s.name AS service_name,
        s.duration_minutes,
        s.price,
        p.id AS patient_id,
        u.first_name AS patient_first_name,
        u.middle_name AS patient_middle_name,
        u.last_name AS patient_last_name,
        p.contact_number
      FROM payments pay
      JOIN appointments a ON pay.appointment_id = a.id
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      JOIN services s ON a.service_id = s.id
      ORDER BY a.appointment_date DESC, a.start_time DESC
    `);

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
