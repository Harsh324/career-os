"use client";

import * as React from "react";
import { GitCommit } from "lucide-react";

export function CareerHeatmap() {
  // Generate 48 weeks of contribution squares
  const weeks = React.useMemo(() => {
    const grid: number[][] = [];
    for (let w = 0; w < 44; w++) {
      const week: number[] = [];
      for (let d = 0; d < 7; d++) {
        const hash = (w * 7 + d * 13) % 17;
        let level = 0;
        if (hash > 12) level = 4;
        else if (hash > 9) level = 3;
        else if (hash > 6) level = 2;
        else if (hash > 4) level = 1;
        week.push(level);
      }
      grid.push(week);
    }
    return grid;
  }, []);

  const getColorClass = (level: number) => {
    switch (level) {
      case 4:
        return "bg-[#216e39] dark:bg-[#39d353]";
      case 3:
        return "bg-[#30a14e] dark:bg-[#26a641]";
      case 2:
        return "bg-[#40c463] dark:bg-[#006d32]";
      case 1:
        return "bg-[#9be9a8] dark:bg-[#0e4429]";
      default:
        return "bg-[#ebedf0] dark:bg-[#161b22]";
    }
  };

  return (
    <div className="w-full rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 text-[#24292f] dark:text-[#c9d1d9] font-semibold">
          <GitCommit className="h-4 w-4 text-[#1f883d] dark:text-[#39d353]" />
          <span>482 Career & Code Contributions in 2026</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#57606a] dark:text-[#8b949e]">
          <span>Less</span>
          <span className="h-2.5 w-2.5 rounded-sm bg-[#ebedf0] dark:bg-[#161b22]" />
          <span className="h-2.5 w-2.5 rounded-sm bg-[#9be9a8] dark:bg-[#0e4429]" />
          <span className="h-2.5 w-2.5 rounded-sm bg-[#40c463] dark:bg-[#006d32]" />
          <span className="h-2.5 w-2.5 rounded-sm bg-[#30a14e] dark:bg-[#26a641]" />
          <span className="h-2.5 w-2.5 rounded-sm bg-[#216e39] dark:bg-[#39d353]" />
          <span>More</span>
        </div>
      </div>

      {/* Fluid Heatmap Grid without forced inner scrollbars */}
      <div className="w-full overflow-x-auto overflow-y-hidden pt-1 pb-2 [scrollbar-width:thin]">
        <div className="flex gap-[3px] w-max">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-[3px]">
              {week.map((level, dIdx) => (
                <div
                  key={dIdx}
                  className={`h-2.5 w-2.5 rounded-[2px] transition-colors ${getColorClass(level)}`}
                  title={`Contribution activity level ${level}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
