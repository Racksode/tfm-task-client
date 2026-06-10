import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: ReactNode;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p className="empty-state-title">{title}</p>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
