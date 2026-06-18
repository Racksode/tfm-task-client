import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth-actions";

import { Nav, type NavItem } from "./nav";

type AppShellProps = {
  children: ReactNode;
  navItems?: NavItem[];
};

const defaultNavItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Inicio",
  },
  {
    href: "/users",
    label: "Usuarios",
  },
];

export function AppShell({ children, navItems = defaultNavItems }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="app-shell-sidebar" aria-label="Navegacion interna">
        <div className="app-shell-brand">
          <span className="app-shell-brand-mark">TC</span>
          <span>TFM Task Client</span>
        </div>
        <Nav items={navItems} />
        <form action={logout} className="app-shell-logout">
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="w-full justify-start"
          >
            Cerrar sesión
          </Button>
        </form>
      </aside>
      <main className="app-shell-main">{children}</main>
    </div>
  );
}
