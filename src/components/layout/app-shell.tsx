import type { ReactNode } from "react";

import { Nav, type NavItem } from "./nav";

type AppShellProps = {
  children: ReactNode;
  navItems?: NavItem[];
};

const defaultNavItems: NavItem[] = [
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
      </aside>
      <main className="app-shell-main">{children}</main>
    </div>
  );
}
