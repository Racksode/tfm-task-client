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
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

import { DeleteTaskDialog } from "./delete-task-dialog";
import {
  TASK_PRIORITY_BADGE,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_BADGE,
  TASK_STATUS_LABELS,
} from "./status";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("es-ES", { dateStyle: "short" }).format(date);

export default async function TasksPage() {
  const session = await requireStaff();
  const role = session.user.role;
  const canUpdate = can(role, "update", "tasks");
  const canDelete = can(role, "delete", "tasks");

  const flash = await readFlash();

  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      createdAt: true,
      project: { select: { name: true } },
      responsible: { select: { name: true } },
    },
  });

  return (
    <AppShell>
      <div className="grid gap-4 p-8">
        <PageHeader
          title="Tareas"
          actions={
            can(role, "create", "tasks") ? (
              <Link href="/tasks/new" className={actionButtonClass("create")}>
                <Plus className="size-4" />
                Nueva tarea
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
            clearFlashOnShow
          />
        ) : null}

        <Card className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Título</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Creada</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No hay tareas registradas. Crea la primera para empezar.
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => {
                  const rowHref = canUpdate
                    ? `/tasks/${task.id}/edit`
                    : `/tasks/${task.id}`;

                  return (
                    <ClickableRow
                      key={task.id}
                      href={rowHref}
                      actions={
                        <>
                          <Link
                            href={`/tasks/${task.id}`}
                            className={iconActionClass("view")}
                            aria-label="Ver"
                            title="Ver detalles"
                          >
                            <Eye className="size-4" />
                          </Link>

                          {canUpdate ? (
                            <Link
                              href={`/tasks/${task.id}/edit`}
                              className={iconActionClass("edit")}
                              aria-label="Editar"
                              title="Editar"
                            >
                              <Pencil className="size-4" />
                            </Link>
                          ) : null}

                          {canDelete ? (
                            <DeleteTaskDialog taskId={task.id} taskTitle={task.title}>
                              <button
                                type="button"
                                className={iconActionClass("delete")}
                                aria-label="Eliminar"
                                title="Eliminar"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </DeleteTaskDialog>
                          ) : null}
                        </>
                      }
                    >
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{task.project.name}</TableCell>
                      <TableCell>
                        <Badge className={TASK_STATUS_BADGE[task.status]}>
                          {TASK_STATUS_LABELS[task.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={TASK_PRIORITY_BADGE[task.priority]}>
                          {TASK_PRIORITY_LABELS[task.priority]}
                        </Badge>
                      </TableCell>
                      <TableCell>{task.responsible?.name ?? "Sin asignar"}</TableCell>
                      <TableCell>{formatDate(task.createdAt)}</TableCell>
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
