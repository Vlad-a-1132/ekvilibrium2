import { clearAdminSession } from "@/lib/auth/admin";
import { redirectTo } from "@/lib/http/redirect";

export async function POST(request: Request) {
  await clearAdminSession();
  return redirectTo(request, "/admin/login");
}
