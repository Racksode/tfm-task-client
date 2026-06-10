import type { ReactNode } from "react";

type AlertProps = {
  children: ReactNode;
  tone?: "error" | "success" | "info";
};

export function Alert({ children, tone = "info" }: AlertProps) {
  return (
    <p className={`ui-alert ui-alert-${tone}`} role={tone === "error" ? "alert" : "status"}>
      {children}
    </p>
  );
}
