import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPHP(amount: number | string) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(
    Number(amount)
  );
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
