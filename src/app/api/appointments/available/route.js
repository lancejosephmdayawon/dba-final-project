import { db } from "@/lib/db";

// GET available appointment slots for a service on a given date
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get("serviceId");
  const date = searchParams.get("date");

  if (!serviceId || !date) return new Response(JSON.stringify([]));

  try {
    // 1. Get service duration
    const [[service]] = await db.query(
      "SELECT duration_minutes FROM services WHERE id = ?",
      [serviceId]
    );
    // Invalid service
    if (!service || service.duration_minutes <= 0) return new Response(JSON.stringify([]));
    const duration = service.duration_minutes;

    // 2. Get day of week safely
    const dayOfWeek = new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" });

    // 3. Get dentist schedule for that day
    const [[schedule]] = await db.query(
      "SELECT start_time, end_time FROM dentist_schedules WHERE day_of_week = ? AND is_active = 1",
      [dayOfWeek]
    );
    if (!schedule) return new Response(JSON.stringify([])); // dentist off that day

    const toMinutes = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    const startMinutes = toMinutes(schedule.start_time);
    const endMinutes = toMinutes(schedule.end_time);

    // 4. Get existing appointments
    const [appointments] = await db.query(
      "SELECT start_time, end_time FROM appointments WHERE appointment_date = ? AND status IN ('pending','approved')",
      [date]
    );

    const slots = [];
    let current = startMinutes;

    const now = new Date();
    const isToday = new Date(date).toDateString() === now.toDateString();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    while (current + duration <= endMinutes) {
      const slotStart = current;
      const slotEnd = current + duration;

      // Check for conflicts
      const conflict = appointments.some((a) => {
        const apptStart = toMinutes(a.start_time);
        const apptEnd = toMinutes(a.end_time);
        return !(slotEnd <= apptStart || slotStart >= apptEnd);
      });

      // Skip if conflict or past time
      if (!conflict && (!isToday || slotStart > nowMinutes)) {
        const h = Math.floor(slotStart / 60).toString().padStart(2, "0");
        const m = (slotStart % 60).toString().padStart(2, "0");
        slots.push(`${h}:${m}`); // format HH:MM for <input type="time">
      }

      current += duration;
    }

    return new Response(JSON.stringify(slots));
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify([]));
  }
}
