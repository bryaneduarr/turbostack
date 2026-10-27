const timestampFormat = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

export function formatTimestamp(timestamp: string): string {
  return `${timestampFormat.format(new Date(timestamp))} UTC`;
}
