// src/app/api/admin/transactions/[id]/summary/route.js
import { db } from "@/lib/db";

// GET transaction summary
export async function GET() {
  // Fetch summary data
  const [[row]] = await db.query(`
    SELECT
      COUNT(*) AS totalTransactions,
      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pendingBalance,
      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS collectedAmount
    FROM payments
  `);

  return Response.json(row);
}
