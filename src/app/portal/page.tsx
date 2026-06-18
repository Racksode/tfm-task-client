import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth-actions";
import { requireSession } from "@/lib/auth-guards";

export default async function PortalPage() {
  const session = await requireSession();

  if (session.user.role !== UserRole.CLIENT) {
    redirect("/");
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">Área de cliente</h1>
      <p className="text-muted-foreground">En construcción.</p>
      <form action={logout}>
        <Button type="submit" variant="outline">
          Cerrar sesión
        </Button>
      </form>
    </main>
  );
}
