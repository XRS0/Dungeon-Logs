export const formatRelativeMinutes = (isoTimestamp) => {
  const formatter = new Intl.RelativeTimeFormat("ru", { style: "narrow" });
  const diffMs = Date.now() - new Date(isoTimestamp).getTime();
  const diffMinutes = Math.round(diffMs / 60000);
  return formatter.format(-diffMinutes, "minute");
};

export const formatTime = (isoTimestamp) =>
  new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date(isoTimestamp));
