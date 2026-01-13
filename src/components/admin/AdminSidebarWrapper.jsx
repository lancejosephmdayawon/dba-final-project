// AdminSidebarWrapper.jsx
"use client";

import { useSession } from "next-auth/react";
import AdminSidebarContent from "@/components/admin/AdminSidebarContent";

export default function AdminSidebarWrapper() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;
  if (!session) return null;

  return <AdminSidebarContent session={session} />;
}
