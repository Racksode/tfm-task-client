import type { ReactNode } from "react";

import { auth } from "@/auth";
import { appConfig } from "@/lib/config";

import { Nav } from "./nav";
import { UserMenu } from "./user-menu";

type AppShellProps = {
  children: ReactNode;
};

export async function AppShell({ children }: AppShellProps) {
  const session = await auth();
  const role = session?.user?.role;

  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <aside className="flex w-full shrink-0 flex-col gap-6 bg-sidebar p-4 text-sidebar-foreground md:w-60">
        <div className="flex items-center gap-2 px-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sm text-sidebar-primary-foreground">
            TC
          </span>
          <span>TFM Task Client</span>
        </div>
        {role ? <Nav role={role} /> : null}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-end border-b px-6">
          <UserMenu name={session?.user?.name} email={session?.user?.email} />
        </header>
        <main className="min-w-0 flex-1">{children}</main>
        <footer className="flex items-center justify-between border-t px-6 py-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} TFM Task Client</span>
          <span>v{appConfig.version}</span>
        </footer>
      </div>
    </div>
  );
}
