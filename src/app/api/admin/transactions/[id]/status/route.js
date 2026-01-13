import { db } from "@/lib/db";

export async function PATCH(req, context) {
  try {
    const params = await context.params; 
    const id = Number(params.id);  
    const { status } = await req.json();

    if (!id || !["pending", "paid"].includes(status)) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    await db.query(
      `
      UPDATE payments
      SET status = ?,
          paid_at = ?
      WHERE id = ?
      `,
      [status, status === "paid" ? new Date() : null, id]
    );

    return Response.json({ success: true });
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
}
