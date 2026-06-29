import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

import { ClickableRow } from "@/components/data/clickable-row";
import { actionButtonClass, iconActionClass } from "@/components/data/icon-action";
import { AlertBanner } from "@/components/feedback/alert-banner";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
import { can, isAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

import { DeleteTimeDialog } from "./delete-time-dialog";
import { TIME_TYPE_BADGE, TIME_TYPE_LABELS, formatDuration } from "./status";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("es-ES", { dateStyle: "short" }).format(date);

export default async function TimesPage() {
  const session = await requireStaff();
  const role = session.user.role;
  const canUpdate = can(role, "update", "times");
  const canDelete = can(role, "delete", "times");
  const seesAll = isAdmin(role);

  const flash = await readFlash();

  // INTERNAL ve solo sus propios registros; ADMIN+ ven los de todos.
  const entries = await prisma.timeEntry.findMany({
    where: seesAll ? undefined : { userId: session.user.id },
    orderBy: [{ workDate: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      workDate: true,
      durationMinutes: true,
      type: true,
      task: { select: { title: true, project: { select: { name: true } } } },
      user: { select: { name: true } },
    },
  });

  return (
    <AppShell>
      <div className="grid gap-4 p-8">
        <PageHeader
          title="Tiempos"
          actions={
            can(role, "create", "times") ? (
              <Link href="/times/new" className={actionButtonClass("create")}>
                <Plus className="size-4" />
                Registrar tiempo
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
                <TableHead>Tarea</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Duración</TableHead>
                {seesAll ? <TableHead>Usuario</TableHead> : null}
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={seesAll ? 7 : 6}
                    className="text-center text-muted-foreground"
                  >
                    No hay tiempos registrados. Registra el primero para empezar.
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => {
                  const rowHref = canUpdate
                    ? `/times/${entry.id}/edit`
                    : `/times/${entry.id}`;

                  return (
                    <ClickableRow
                      key={entry.id}
                      href={rowHref}
                      actions={
                        <>
                          <Link
                            href={`/times/${entry.id}`}
                            className={iconActionClass("view")}
                            aria-label="Ver"
                            title="Ver detalles"
                          >
                            <Eye className="size-4" />
                          </Link>

                          {canUpdate ? (
                            <Link
                              href={`/times/${entry.id}/edit`}
                              className={iconActionClass("edit")}
                              aria-label="Editar"
                              title="Editar"
                            >
                              <Pencil className="size-4" />
                            </Link>
                          ) : null}

                          {canDelete ? (
                            <DeleteTimeDialog
                              timeEntryId={entry.id}
                              label={`${entry.task.title} · ${formatDate(entry.workDate)}`}
                            >
                              <button
                                type="button"
                                className={iconActionClass("delete")}
                                aria-label="Eliminar"
                                title="Eliminar"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </DeleteTimeDialog>
                          ) : null}
                        </>
                      }
                    >
                      <TableCell className="font-medium">
                        {entry.task.title}
                      </TableCell>
                      <TableCell>{entry.task.project.name}</TableCell>
                      <TableCell>{formatDate(entry.workDate)}</TableCell>
                      <TableCell>{formatDuration(entry.durationMinutes)}</TableCell>
                      {seesAll ? (
                        <TableCell>{entry.user.name}</TableCell>
                      ) : null}
                      <TableCell>
                        <Badge className={TIME_TYPE_BADGE[entry.type]}>
                          {TIME_TYPE_LABELS[entry.type]}
                        </Badge>
                      </TableCell>
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
