'use client';

import type { CommitActivityWeek } from '@/lib/github.types';

const LEVELS = [
  { min: 0, max: 0, bg: 'bg-neutral-100' },
  { min: 1, max: 2, bg: 'bg-neutral-300' },
  { min: 3, max: 5, bg: 'bg-neutral-500' },
  { min: 6, max: 9, bg: 'bg-neutral-700' },
  { min: 10, max: Infinity, bg: 'bg-black' },
];

function getLevel(count: number) {
  return LEVELS.find((l) => count >= l.min && count <= l.max) ?? LEVELS[0];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface ContributionHeatmapProps {
  data: CommitActivityWeek[];
}

export function ContributionHeatmap({ data }: ContributionHeatmapProps) {
  if (data.length === 0) {
    return (
      <div>
        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">GitHub Activity</p>
        <p className="text-sm text-neutral-400 font-mono">no activity data</p>
      </div>
    );
  }

  const monthLabels: Array<{ month: string; weekIndex: number }> = [];
  let lastMonth = -1;
  for (let i = 0; i < data.length; i++) {
    const m = new Date(data[i].week * 1000).getMonth();
    if (m !== lastMonth) {
      monthLabels.push({ month: MONTHS[m], weekIndex: i });
      lastMonth = m;
    }
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3">GitHub Activity</p>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="inline-flex gap-0.5">
          <div className="flex flex-col gap-0.5 mr-1 pt-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <span key={d} className="text-[9px] font-mono text-neutral-400 h-[10px] leading-[10px]">
                {i % 2 === 1 ? d : ''}
              </span>
            ))}
          </div>
          <div className="flex">
            {data.map((week, wi) => {
              const ml = monthLabels.find((m) => m.weekIndex === wi);
              return (
                <div key={week.week} className="w-[10px] mr-0.5">
                  <span className="text-[9px] font-mono text-neutral-400 h-4 leading-4 block">
                    {ml ? ml.month : ''}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    {week.days.map((count, di) => {
                      const level = getLevel(count);
                      const dt = new Date((week.week + di * 86400) * 1000);
                      const dateStr = `${MONTHS[dt.getMonth()]} ${dt.getDate()}`;
                      return (
                        <div
                          key={di}
                          className={`w-[10px] h-[10px] rounded-sm ${level.bg}`}
                          title={`${count} commit${count !== 1 ? 's' : ''} on ${dateStr}`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
