import type { CommitActivityWeek } from './github.types';

export function computeStreak(weeks: CommitActivityWeek[]): number {
  if (weeks.length === 0) return 0;

  // Walk backwards from the most recent week
  let streak = 0;
  for (let i = weeks.length - 1; i >= 0; i--) {
    if (weeks[i].total > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
