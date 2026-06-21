import { ProjectStatus } from "@prisma/client";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

import { AlertBanner } from "@/components/feedback/alert-banner";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ClickableRow } from "@/components/data/clickable-row";
import { actionButtonClass, iconActionClass } from "@/components/data/icon-action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireStaff } from "@/lib/auth-guards";
import { appConfig } from "@/lib/config";
import { readFlash } from "@/lib/flash";
import { clearFlash } from "@/lib/flash-actions";
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

import { DeleteProjectDialog } from "./delete-project-dialog";
import { PROJECT_STATUS_LABELS } from "./status";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("es-ES", { dateStyle: "short" }).format(date);

const currency = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

const STATUS_BADGE: Record<ProjectStatus, string> = {
  [ProjectStatus.ACTIVE]: "border-transparent bg-green-600 text-white",
  [ProjectStatus.PAUSED]: "border-transparent bg-amber-500 text-white",
  [ProjectStatus.COMPLETED]: "border-transparent bg-slate-600 text-white",
  [ProjectStatus.CANCELLED]: "border-transparent bg-rose-600 text-white",
};

const StatusBadge = ({ status }: { status: ProjectStatus }) => (
  <Badge className={STATUS_BADGE[status]}>{PROJECT_STATUS_LABELS[status]}</Badge>
);

export default async function ProjectsPage() {
  const session = await requireStaff();
  const role = session.user.role;
  const canUpdate = can(role, "update", "projects");
  const canDelete = can(role, "delete", "projects");

  const flash = await readFlash();

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      status: true,
      baseRate: true,
      createdAt: true,
      client: { select: { name: true } },
    },
  });

  return (
    <AppShell>
      <div className="grid gap-4 p-8">
        <PageHeader
          title="Proyectos"
          actions={
            can(role, "create", "projects") ? (
              <Link href="/projects/new" className={actionButtonClass("create")}>
                <Plus className="size-4" />
                Nuevo proyecto
              </Link>
            ) : null
          }
        />

        {flash ? (
          <AlertBanner
            key={flash.id}
            type={flash.type}
            message={flash.message}
            dismissMs={appConfig.alertAutoDismissMs}
            onDismiss={clearFlash}
          />
        ) : null}

        <Card className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Nombre</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Tarifa</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No hay proyectos registrados. Crea el primero para empezar.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => {
                  const rowHref = canUpdate
                    ? `/projects/${project.id}/edit`
                    : `/projects/${project.id}`;

                  return (
                    <ClickableRow
                      key={project.id}
                      href={rowHref}
                      actions={
                        <>
                          <Link
                            href={`/projects/${project.id}`}
                            className={iconActionClass("view")}
                            aria-label="Ver"
                            title="Ver detalles"
                          >
                            <Eye className="size-4" />
                          </Link>

                          {canUpdate ? (
                            <Link
                              href={`/projects/${project.id}/edit`}
                              className={iconActionClass("edit")}
                              aria-label="Editar"
                              title="Editar"
                            >
                              <Pencil className="size-4" />
                            </Link>
                          ) : null}

                          {canDelete ? (
                            <DeleteProjectDialog
                              projectId={project.id}
                              projectName={project.name}
                            >
                              <button
                                type="button"
                                className={iconActionClass("delete")}
                                aria-label="Eliminar"
                                title="Eliminar"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </DeleteProjectDialog>
                          ) : null}
                        </>
                      }
                    >
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.client.name}</TableCell>
                      <TableCell>
                        <StatusBadge status={project.status} />
                      </TableCell>
                      <TableCell>
                        {project.baseRate
                          ? currency.format(Number(project.baseRate))
                          : "—"}
                      </TableCell>
                      <TableCell>{formatDate(project.createdAt)}</TableCell>
                    </ClickableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AppShell>
  );
}
