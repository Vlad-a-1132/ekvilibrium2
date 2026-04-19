import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { isAdminAuthenticated } from "@/lib/auth/admin";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/orders");
  }

  return (
    <div className="min-h-screen bg-[#f4f0ea] px-4 py-16 text-[#2a2622]">
      <div className="mx-auto w-full max-w-[400px]">
        <p className="text-center font-serif text-lg text-[#403A34]">Эквилибриум</p>
        <h1 className="mt-2 text-center text-sm font-medium uppercase tracking-[0.12em] text-[#403A34]/55">
          Вход в админку
        </h1>
        <div className="mt-10 rounded-2xl border border-[#403A34]/12 bg-[#fbf8f4] p-8 shadow-[0_20px_50px_-28px_rgba(64,58,52,0.35)]">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
