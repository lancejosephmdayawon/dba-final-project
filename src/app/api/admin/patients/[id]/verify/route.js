// Path: src/app/api/admin/patients/[id]/verify/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }

  const { verified } = await req.json();

  await db.query(
    `UPDATE users SET email_verified=? WHERE id=?`,
    [verified ? 1 : 0, params.id]
  );

  return Response.json({ success: true });
}
