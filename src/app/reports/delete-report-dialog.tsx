"use client";

import type { ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { deleteReport } from "./actions";

type DeleteReportDialogProps = {
  reportId: string;
  label: string;
  children: ReactNode;
};

export function DeleteReportDialog({
  reportId,
  label,
  children,
}: DeleteReportDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar reporte</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Seguro que quieres eliminar el reporte «{label}»? Esta acción no se
            puede deshacer. Si tiene usos de IA vinculados, se bloqueará.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <form action={deleteReport}>
            <input type="hidden" name="reportId" value={reportId} />
            <AlertDialogAction type="submit">Eliminar</AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
