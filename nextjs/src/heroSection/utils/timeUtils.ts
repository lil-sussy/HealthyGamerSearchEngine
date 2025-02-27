export function formatTimestamp(seconds: number) {
  const date = new Date(0);
  date.setSeconds(seconds);
  const timeString = date.toISOString().substr(11, 8);
  return timeString.startsWith("00:") ? timeString.substr(3) : timeString;
}