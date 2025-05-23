import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    !["admin", "super_admin"].includes(session.user?.role as string)
  ) {
    redirect("/admin/login");
  }
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {session.user?.name}!
      </h1>
      <p className="text-lg">This is your admin dashboard.</p>
      {session.user?.role === "super_admin" && (
        <p className="text-sm text-neon-primary dark:text-neon-primary-dark mt-2">
          You are logged in as a Super Admin
        </p>
      )}
    </div>
  );
}
