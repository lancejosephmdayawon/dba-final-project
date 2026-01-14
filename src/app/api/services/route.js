import { db } from "@/lib/db"; // your MySQL pool

// GET to fetch available services
export async function GET(req) {
  try {
    // Fetch services
    const [services] = await db.query("SELECT id, name, duration_minutes FROM services ORDER BY name");
    return new Response(JSON.stringify(services), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch services" }), { status: 500 });
  }
}
