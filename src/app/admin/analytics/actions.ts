"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { COOKIE, keyMatches } from "@/lib/analytics/auth";

export async function login(formData: FormData) {
  const key = String(formData.get("key") ?? "");
  if (!keyMatches(key)) redirect("/admin/analytics?error=1");
  (await cookies()).set(COOKIE, key, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/admin/analytics");
}

export async function logout() {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
  redirect("/admin/analytics");
}
