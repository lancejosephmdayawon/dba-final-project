"use client";

import { useSession } from "next-auth/react";
import SidebarContent from "@/components/patient/SidebarContent";

export default function SidebarWrapper() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;
  if (!session) return null;

  return <SidebarContent session={session} />;
}
