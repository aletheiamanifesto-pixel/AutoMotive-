import type { ComponentProps } from "react";

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`rounded-xl border border-border bg-surface p-5 ${className}`} {...props} />;
}

export function Badge({ className = "", ...props }: ComponentProps<"span">) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-border bg-surface-2 px-2 py-0.5 text-xs text-muted ${className}`}
      {...props}
    />
  );
}
