import { db } from "@/lib/db";

export async function POST(req) {
  const { patientId, serviceId, date, time, notes } = await req.json();

  try {
    // 1. Get service
    const [[service]] = await db.query(
      "SELECT duration_minutes FROM services WHERE id = ?",
      [serviceId]
    );
    if (!service) {
      return new Response(JSON.stringify({ message: "Service not found" }), { status: 400 });
    }
    const duration = service.duration_minutes;

    // 2. Check dentist schedule
    const dayOfWeek = new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" });
    const [[schedule]] = await db.query(
      "SELECT start_time, end_time FROM dentist_schedules WHERE day_of_week = ? AND is_active = 1",
      [dayOfWeek]
    );
    if (!schedule) {
      return new Response(JSON.stringify({ message: `Dentist is not available on ${dayOfWeek}` }), { status: 400 });
    }

    // 3. Calculate end time
    const [h, m] = time.split(":").map(Number);
    let endHour = h + Math.floor((m + duration) / 60);
    let endMin = (m + duration) % 60;
    const endTime = `${endHour.toString().padStart(2,'0')}:${endMin.toString().padStart(2,'0')}:00`;

    // Prevent booking past working hours
    if (endTime > schedule.end_time) {
      return new Response(JSON.stringify({ message: "Appointment exceeds working hours" }), { status: 400 });
    }

    // 4. Prevent booking past time for today
    const now = new Date();
    if (new Date(date).toDateString() === now.toDateString() && (h < now.getHours() || (h === now.getHours() && m <= now.getMinutes()))) {
      return new Response(JSON.stringify({ message: "Cannot book past time" }), { status: 400 });
    }

    // 5. Check conflicts
    const [conflicts] = await db.query(
      "SELECT * FROM appointments WHERE appointment_date = ? AND status IN ('pending','approved') AND NOT (end_time <= ? OR start_time >= ?)",
      [date, time, endTime]
    );

    if (conflicts.length > 0) {
      return new Response(JSON.stringify({ message: "This time slot is already taken" }), { status: 400 });
    }

    // 6. Insert appointment
    await db.query(
      "INSERT INTO appointments (patient_id, service_id, appointment_date, start_time, end_time, status, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'pending', ?, NOW(), NOW())",
      [patientId, serviceId, date, time, endTime, notes?.trim() || null]
    );

    return new Response(JSON.stringify({ message: "Appointment booked successfully" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Failed to book appointment" }), { status: 500 });
  }
}
