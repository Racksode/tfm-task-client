"use client";

import { UserRole } from "@prisma/client";
import {
  Building2,
  Clock,
  Coins,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  Users,
  type LucideIcon,
} from "lucide-react";
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
  [
    { href: "/clients", label: "Clientes", icon: Building2, section: "clients" },
    { href: "/projects", label: "Proyectos", icon: FolderKanban, section: "projects" },
    { href: "/tasks", label: "Tareas", icon: ListChecks, section: "tasks" },
    { href: "/times", label: "Tiempos", icon: Clock, section: "times" },
  ],
  [
    { href: "/users", label: "Usuarios", icon: Users, section: "users" },
    { href: "/rates", label: "Tarifas", icon: Coins, section: "rates" },
  ],
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
                  "flex items-center gap-2 rounded-md border-l-2 border-transparent px-3 py-1.5 text-sm font-medium text-sidebar-foreground/70 transition-colors",
                  "hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                  active &&
                    "border-sidebar-primary bg-sidebar-accent/50 text-sidebar-foreground",
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
