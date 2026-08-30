const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

export function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  if (diff < MINUTE) return 'just now';
  if (diff < HOUR) {
    const mins = Math.floor(diff / MINUTE);
    return `${mins} min ago`;
  }
  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR);
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  }
  if (diff < 2 * DAY) return 'yesterday';
  if (diff < WEEK) {
    const days = Math.floor(diff / DAY);
    return `${days} days ago`;
  }
  if (diff < 2 * WEEK) return '1 week ago';
  if (diff < MONTH) {
    const weeks = Math.floor(diff / WEEK);
    return `${weeks} weeks ago`;
  }
  if (diff < YEAR) {
    const months = Math.floor(diff / MONTH);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }
  const years = Math.floor(diff / YEAR);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}
