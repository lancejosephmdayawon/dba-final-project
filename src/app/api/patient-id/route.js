import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ patientId: null }, { status: 401 });
  }

  const userId = session.user.id; // users.id

  const [rows] = await db.query(
    "SELECT id FROM patients WHERE user_id = ? LIMIT 1",
    [userId]
  );

  return Response.json({
    patientId: rows.length ? rows[0].id : null, // patients.id
  });
}
