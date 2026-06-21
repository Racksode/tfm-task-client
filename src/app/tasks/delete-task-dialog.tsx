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

import { deleteTask } from "./actions";

type DeleteTaskDialogProps = {
  taskId: string;
  taskTitle: string;
  children: ReactNode;
};

export function DeleteTaskDialog({ taskId, taskTitle, children }: DeleteTaskDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar tarea</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Seguro que quieres eliminar «{taskTitle}»? Esta acción no se puede
            deshacer. Si la tarea tiene tiempos registrados, se bloqueará y
            deberás cambiarla de estado en su lugar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <form action={deleteTask}>
            <input type="hidden" name="taskId" value={taskId} />
            <AlertDialogAction type="submit">Eliminar</AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
