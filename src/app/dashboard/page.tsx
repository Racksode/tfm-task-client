import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { requireStaff } from "@/lib/auth-guards";

export default async function DashboardPage() {
  await requireStaff();

  return (
    <AppShell>
      <div className="p-8">
        <PageHeader title="Dashboard" />
      </div>
    </AppShell>
  );
}
