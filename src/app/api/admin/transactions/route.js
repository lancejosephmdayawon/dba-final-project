import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT
        p.id                AS payment_id,
        p.amount,
        p.status            AS payment_status,
        p.payment_method,
        p.paid_at,

        a.id                AS appointment_id,
        a.appointment_date,
        a.start_time,
        a.end_time,
        a.notes,

        s.name              AS service_name,
        s.duration_minutes,
        s.price,

        u.first_name,
        u.middle_name,
        u.last_name,
        pt.contact_number

      FROM payments p
      JOIN appointments a ON p.appointment_id = a.id
      JOIN services s ON a.service_id = s.id
      JOIN patients pt ON a.patient_id = pt.id
      JOIN users u ON pt.user_id = u.id

      ORDER BY a.appointment_date DESC, a.start_time DESC
    `);

    return Response.json(rows);
  } catch (err) {
    console.error("FETCH TRANSACTIONS ERROR:", err);
    return Response.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
