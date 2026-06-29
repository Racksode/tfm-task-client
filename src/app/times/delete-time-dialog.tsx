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

import { deleteTimeEntry } from "./actions";

type DeleteTimeDialogProps = {
  timeEntryId: string;
  label: string;
  children: ReactNode;
};

export function DeleteTimeDialog({
  timeEntryId,
  label,
  children,
}: DeleteTimeDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar registro de tiempo</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Seguro que quieres eliminar el registro «{label}»? Esta acción no se
            puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <form action={deleteTimeEntry}>
            <input type="hidden" name="timeEntryId" value={timeEntryId} />
            <AlertDialogAction type="submit">Eliminar</AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
