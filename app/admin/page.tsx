import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";
import {
  ADMIN_SESSION_COOKIE,
  isValidAdminSessionToken,
} from "@/lib/server/admin-auth";

export default async function AdminDashboardPage() {
  const sessionToken = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidAdminSessionToken(sessionToken)) {
    redirect("/admin/login");
  }

  return <AdminDashboardClient />;
}
