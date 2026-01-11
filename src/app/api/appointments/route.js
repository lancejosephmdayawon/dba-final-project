import { db } from "@/lib/db";

export async function POST(req) {
  const { patientId, serviceId, date, time, notes } = await req.json();

  try {
    const [[service]] = await db.query("SELECT duration_minutes FROM services WHERE id = ?", [serviceId]);
    if (!service) return new Response(JSON.stringify({ message: "Service not found" }), { status: 400 });

    const duration = service.duration_minutes;

    // calculate end time
    const [h, m] = time.split(":").map(Number);
    let endHour = h + Math.floor((m + duration) / 60);
    let endMin = (m + duration) % 60;
    const endTime = `${endHour.toString().padStart(2,'0')}:${endMin.toString().padStart(2,'0')}:00`;

    // check conflict
    const [conflicts] = await db.query(
      "SELECT * FROM appointments WHERE appointment_date = ? AND status IN ('pending','approved') AND NOT (end_time <= ? OR start_time >= ?)",
      [date, time, endTime]
    );

    if (conflicts.length > 0) {
      return new Response(JSON.stringify({ message: "This time slot is already taken" }), { status: 400 });
    }

    await db.query(
      "INSERT INTO appointments (patient_id, service_id, appointment_date, start_time, end_time, status, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'pending', ?, NOW(), NOW())",
      [patientId, serviceId, date, time, endTime, notes || null]
    );

    return new Response(JSON.stringify({ message: "Appointment booked successfully" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Failed to book appointment" }), { status: 500 });
  }
}
