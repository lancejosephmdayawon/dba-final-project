// src/app/api/admin/transactions/[id]/route.js
import { db } from "@/lib/db";

export async function PATCH(req, context) {
  try {
    const params = await context.params; // await params
    const id = Number(params.id);

    const { status, payment_method } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
    }

    // Validate status
    const validStatuses = ["pending", "paid"];
    if (status && !validStatuses.includes(status)) {
      return new Response(JSON.stringify({ error: "Invalid status" }), { status: 400 });
    }

    // Validate payment method
    const validMethods = ["cash", "gcash", "card", "other"];
    if (payment_method && !validMethods.includes(payment_method)) {
      return new Response(JSON.stringify({ error: "Invalid payment method" }), { status: 400 });
    }

    // Update query
    const fields = [];
    const values = [];

    if (status) {
      fields.push("status = ?");
      values.push(status);
      if (status === "paid") {
        fields.push("paid_at = ?");
        values.push(new Date());
      } else {
        fields.push("paid_at = NULL");
      }
    }

    if (payment_method) {
      fields.push("payment_method = ?");
      values.push(payment_method);
    }

    values.push(id);

    await db.query(
      `UPDATE payments SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return new Response(JSON.stringify({ message: "Payment updated" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
