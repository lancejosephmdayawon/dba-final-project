// src/app/api/transactions/route.js
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";

// GET to fetch user transactions
export async function GET(req) {
  try {
    // Get current user from session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    const userId = session.user.id;

    // Fetch transactions joined with appointments & services
    const [transactions] = await db.query(`
      SELECT 
        payments.id AS payment_id,
        payments.amount,
        payments.payment_method,
        payments.status AS payment_status,
        payments.paid_at,
        appointments.appointment_date,
        appointments.start_time,
        appointments.end_time,
        services.name AS service_name
      FROM payments
      JOIN appointments ON payments.appointment_id = appointments.id
      JOIN services ON appointments.service_id = services.id
      JOIN patients ON appointments.patient_id = patients.id
      JOIN users ON patients.user_id = users.id
      WHERE users.id = ?
      ORDER BY payments.paid_at DESC
    `, [userId]);

    return new Response(JSON.stringify(transactions), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Failed to fetch transactions:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch transactions" }), { status: 500 });
  }
}
