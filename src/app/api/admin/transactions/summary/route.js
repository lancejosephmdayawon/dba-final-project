// src/app/api/admin/transactions/[id]/summary/route.js
import { db } from "@/lib/db";

export async function GET() {
  const [[row]] = await db.query(`
    SELECT
      COUNT(*) AS totalTransactions,
      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pendingBalance,
      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS collectedAmount
    FROM payments
  `);

  return Response.json(row);
}
