import type { ReactNode } from "react";

import { EmptyState } from "./empty-state";

export type DataTableColumn<Row> = {
  key: string;
  header: ReactNode;
  render: (row: Row) => ReactNode;
};

type DataTableProps<Row> = {
  columns: DataTableColumn<Row>[];
  rows: Row[];
  getRowKey: (row: Row) => string;
  emptyTitle: string;
  emptyDescription?: ReactNode;
  actions?: (row: Row) => ReactNode;
};

export function DataTable<Row>({
  columns,
  rows,
  getRowKey,
  emptyTitle,
  emptyDescription,
  actions,
}: DataTableProps<Row>) {
  if (rows.length === 0) {
    return <EmptyState description={emptyDescription} title={emptyTitle} />;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
            {actions ? <th>Acciones</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)}>
              {columns.map((column) => (
                <td key={column.key}>{column.render(row)}</td>
              ))}
              {actions ? <td>{actions(row)}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
