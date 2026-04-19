import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminAuth } from "@/lib/auth/admin";
import { getUnreadAdminNotificationCount } from "@/lib/queries/admin-notifications";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAdminAuth();
  const unreadNotificationCount = await getUnreadAdminNotificationCount();
  return (
    <AdminShell unreadNotificationCount={unreadNotificationCount}>{children}</AdminShell>
  );
}
