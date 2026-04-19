import { NextResponse } from "next/server";

import { clearAdminSession } from "@/lib/auth/admin";

export async function POST(request: Request) {
  await clearAdminSession();
  const url = new URL("/admin/login", request.url);
  return NextResponse.redirect(url);
}
