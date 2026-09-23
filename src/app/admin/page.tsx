"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

export default function AdminRootRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace(ROUTES.admin.dashboard);
  }, [router]);
  return null;
}
