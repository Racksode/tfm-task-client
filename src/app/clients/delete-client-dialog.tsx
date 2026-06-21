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

import { deleteClient } from "./actions";

type DeleteClientDialogProps = {
  clientId: string;
  clientName: string;
  children: ReactNode;
};

export function DeleteClientDialog({
  clientId,
  clientName,
  children,
}: DeleteClientDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar cliente</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Seguro que quieres eliminar a «{clientName}»? Esta acción no se puede
            deshacer. Si el cliente tiene datos vinculados, se bloqueará y
            deberás desactivarlo en su lugar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <form action={deleteClient}>
            <input type="hidden" name="clientId" value={clientId} />
            <AlertDialogAction type="submit">Eliminar</AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
