import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

const variants: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
};

export function Badge({ label, variant = "default" }: { label: string; variant?: BadgeVariant }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", variants[variant])}>
      {label}
    </span>
  );
}

export function statusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    ACTIVE: "success", APPROVED: "success", CONFIRMED: "success", COMPLETED: "success",
    PENDING: "warning", TRIALING: "info",
    REJECTED: "danger", SUSPENDED: "danger", CANCELLED: "danger", FAILED: "danger",
  };
  return map[status] ?? "default";
}
