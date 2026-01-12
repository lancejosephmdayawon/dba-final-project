// /src/app/api/appointments/upcoming/route.js
import mysql from "mysql2/promise";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth"; // adjust path if needed

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// GET for fetching upcoming appointments
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const userId = session.user.id;
    const [[patient]] = await db.query("SELECT id FROM patients WHERE user_id = ?", [userId]);

    if (!patient) {
      return new Response(JSON.stringify({ appointments: [] }), { status: 200 }); 
      // <-- always return JSON
    }

    const [appointments] = await db.query(
      `
      SELECT a.id, a.status, a.appointment_date, a.start_time, s.name AS service_name
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      WHERE a.patient_id = ?
      ORDER BY a.appointment_date ASC, a.start_time ASC
      `,
      [patient.id]
    );

    return new Response(JSON.stringify({ appointments }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ appointments: [] }), { status: 500 });
  }
}

// POST for cancelling an appointment
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const userId = session.user.id;
  const { appointmentId } = await req.json();

  const [[patient]] = await db.query("SELECT id FROM patients WHERE user_id = ?", [userId]);
  if (!patient) {
    return new Response(JSON.stringify({ error: "Patient not found" }), { status: 404 });
  }

  // Make sure the appointment belongs to this patient
  const [[appt]] = await db.query(
    "SELECT id FROM appointments WHERE id = ? AND patient_id = ?",
    [appointmentId, patient.id]
  );

  if (!appt) {
    return new Response(JSON.stringify({ error: "Not allowed" }), { status: 403 });
  }

  await db.query("UPDATE appointments SET status = 'cancelled' WHERE id = ?", [appointmentId]);

  return new Response(JSON.stringify({ message: "Appointment cancelled" }), { status: 200 });
}
