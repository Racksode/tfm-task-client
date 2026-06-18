"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { TableCell, TableRow } from "@/components/ui/table";

type ClickableRowProps = {
  /** Destino al hacer doble clic en la fila. */
  href: string;
  children: ReactNode;
  actions?: ReactNode;
};

export function ClickableRow({ href, children, actions }: ClickableRowProps) {
  const router = useRouter();

  return (
    <TableRow
      className="cursor-pointer"
      onDoubleClick={() => router.push(href)}
    >
      {children}
      {actions !== undefined ? (
        <TableCell onDoubleClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-end gap-2">{actions}</div>
        </TableCell>
      ) : null}
    </TableRow>
  );
}
