/** Formats MM-DD-YYYY as "MM - DD - YYYY" for card history display. */
export function formatHistoryDate(date: string): string {
  const parts = date.split("-");
  if (parts.length !== 3) return date;
  return parts.join(" - ");
}
