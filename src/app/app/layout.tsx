import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { getCurrentUser } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="grain min-h-screen">
      <AppHeader email={user.email} planId={user.plan} />
      <div className="mx-auto max-w-6xl px-5 py-8">{children}</div>
    </div>
  );
}
