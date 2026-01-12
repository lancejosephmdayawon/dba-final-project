import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    // Pass the request to getServerSession
    const session = await getServerSession({ req, ...authOptions });
    // console.log("Session in API:", session);

    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;

    const [rows] = await db.query(
      `
      SELECT
        IFNULL(SUM(CASE WHEN p.status = 'pending' THEN p.amount ELSE 0 END), 0) AS totalBalance,
        COUNT(CASE WHEN p.status = 'pending' THEN 1 END) AS pendingPayments,
        COUNT(p.id) AS totalTransactions
      FROM payments p
      INNER JOIN appointments a ON p.appointment_id = a.id
      INNER JOIN patients pa ON a.patient_id = pa.id
      INNER JOIN users u ON pa.user_id = u.id
      WHERE u.id = ?
      `,
      [userId]
    );

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("Error fetching summary:", err);
    return NextResponse.json({ error: "Failed to fetch summary" }, { status: 500 });
  }
}
