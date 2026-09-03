export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric" }).format(new Date(value));
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}