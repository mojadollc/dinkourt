export function formatPHP(amount: number): string {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-PH", {
    year: "numeric", month: "short", day: "numeric",
  });
}
