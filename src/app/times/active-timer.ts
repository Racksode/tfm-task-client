import { TimeEntryType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type ActiveTimer = {
  id: string;
  taskId: string;
  taskTitle: string;
  startedAt: Date;
};

/**
 * Devuelve el cronómetro en curso del usuario (registro START_STOP sin cerrar),
 * o null si no hay ninguno. Solo puede haber uno activo por usuario.
 */
export async function getActiveTimer(
  userId: string,
): Promise<ActiveTimer | null> {
  const timer = await prisma.timeEntry.findFirst({
    where: {
      userId,
      type: TimeEntryType.START_STOP,
      endedAt: null,
    },
    orderBy: { startedAt: "desc" },
    select: {
      id: true,
      taskId: true,
      startedAt: true,
      task: { select: { title: true } },
    },
  });

  if (!timer || !timer.startedAt) {
    return null;
  }

  return {
    id: timer.id,
    taskId: timer.taskId,
    taskTitle: timer.task.title,
    startedAt: timer.startedAt,
  };
}
