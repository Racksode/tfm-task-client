"use client";

import { UserRole } from "@prisma/client";
import { LayoutDashboard, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { can, type Section } from "@/lib/permissions";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  section: Section;
};

// Bloques de navegación (se separan visualmente). Las secciones de negocio
// se añadirán a su bloque a medida que se implementen los módulos.
const BLOCKS: NavItem[][] = [
  [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, section: "dashboard" }],
  [{ href: "/users", label: "Usuarios", icon: Users, section: "users" }],
];

export function Nav({ role }: { role: UserRole }) {
  const pathname = usePathname();

  const blocks = BLOCKS.map((block) =>
    block.filter((item) => can(role, "view", item.section)),
  ).filter((block) => block.length > 0);

  return (
    <nav className="grid gap-4" aria-label="Secciones">
      {blocks.map((block, index) => (
        <div
          key={index}
          className={cn(
            "grid gap-1",
            index > 0 && "border-t border-sidebar-border pt-4",
          )}
        >
          {block.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  active &&
                    "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
