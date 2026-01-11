import { db } from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get("serviceId");
  const date = searchParams.get("date");

  if (!serviceId || !date) return new Response(JSON.stringify([]));

  try {
    // 1. Get service duration
    const [[service]] = await db.query("SELECT duration_minutes FROM services WHERE id = ?", [serviceId]);
    if (!service) return new Response(JSON.stringify([]));
    const duration = service.duration_minutes;

    // 2. Get day of week for date
    const dayOfWeek = new Date(date).toLocaleDateString("en-US", { weekday: "long" });

    // 3. Get dentist schedule for that day
    const [[schedule]] = await db.query(
      "SELECT start_time, end_time FROM dentist_schedules WHERE day_of_week = ? AND is_active = 1",
      [dayOfWeek]
    );

    if (!schedule) return new Response(JSON.stringify([])); // dentist off that day

    const startTimeParts = schedule.start_time.split(":").map(Number);
    const endTimeParts = schedule.end_time.split(":").map(Number);

    // 4. Get existing appointments for that date
    const [appointments] = await db.query(
      "SELECT start_time, end_time FROM appointments WHERE appointment_date = ? AND status IN ('pending','approved')",
      [date]
    );

    // 5. Generate possible slots
    const slots = [];
    let currentHour = startTimeParts[0];
    let currentMin = startTimeParts[1];

    while (currentHour < endTimeParts[0] || (currentHour === endTimeParts[0] && currentMin < endTimeParts[1])) {
      const slotStart = `${currentHour.toString().padStart(2,'0')}:${currentMin.toString().padStart(2,'0')}:00`;

      let endHour = currentHour + Math.floor((currentMin + duration) / 60);
      let endMin = (currentMin + duration) % 60;
      const slotEnd = `${endHour.toString().padStart(2,'0')}:${endMin.toString().padStart(2,'0')}:00`;

      // Check conflict
      const conflict = appointments.some(a =>
        !(slotEnd <= a.start_time || slotStart >= a.end_time)
      );

      if (!conflict) slots.push(slotStart);

      // Increment by duration
      currentHour = endHour;
      currentMin = endMin;
    }

    return new Response(JSON.stringify(slots));
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify([]));
  }
}
