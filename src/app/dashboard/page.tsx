import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { requireInternal } from "@/lib/auth-guards";

export default async function DashboardPage() {
  await requireInternal();

  return (
    <AppShell>
      <div className="p-8">
        <PageHeader
          eyebrow="Panel interno"
          title="Dashboard"
          description="Panel de inicio en construcción."
        />
      </div>
    </AppShell>
  );
}
