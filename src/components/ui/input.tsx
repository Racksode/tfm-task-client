import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  const classes = ["ui-field", className].filter(Boolean).join(" ");

  return <input className={classes} {...props} />;
}
