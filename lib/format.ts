export function formatUSD(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatDate(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function formatDateTime(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export function formatRelative(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  const diff = (Date.now() - d.getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (diff < 60) return rtf.format(-Math.floor(diff), "second");
  if (diff < 3600) return rtf.format(-Math.floor(diff / 60), "minute");
  if (diff < 86400) return rtf.format(-Math.floor(diff / 3600), "hour");
  if (diff < 2592000) return rtf.format(-Math.floor(diff / 86400), "day");
  if (diff < 31536000) return rtf.format(-Math.floor(diff / 2592000), "month");
  return rtf.format(-Math.floor(diff / 31536000), "year");
}

export function formatSpecialization(spec: string): string {
  const map: Record<string, string> = {
    Criminal: "Criminal Defense",
    Corporate: "Corporate Law",
    Family: "Family Law",
    Tax: "Tax Law",
    Immigration: "Immigration Law",
    "Real Estate": "Real Estate Law",
    Labor: "Labor Law",
  };
  return map[spec] || spec;
}
