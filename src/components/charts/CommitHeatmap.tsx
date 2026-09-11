import React, { useState, useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { Calendar, Flame } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

interface CommitHeatmapProps {
  data: Array<[string, number]> // [YYYY-MM-DD, count]
}

interface EChartsHeatmapParam {
  data?: [string, number]
}

export const CommitHeatmap: React.FC<CommitHeatmapProps> = ({ data }) => {
  const { theme } = useTheme()
  // Extract distinct available years from commit data
  const availableYears = useMemo(() => {
    const set = new Set<string>()
    data.forEach(([date]) => {
      if (date && date.length >= 4) {
        set.add(date.slice(0, 4))
      }
    })
    return Array.from(set).sort().reverse()
  }, [data])

  // Determine the default selected timeframe:
  // If data spans > 1 year, provide "Recent (12M)" or the most active year
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('recent')

  // Calculate start and end date for the selected timeframe
  const { range, filteredData, periodCommits, activeDays, maxDayCommits } = useMemo(() => {
    let rangeStart: string
    let rangeEnd: string
    let filtered = data

    if (data.length === 0) {
      const now = new Date()
      const past = new Date()
      past.setDate(now.getDate() - 365)
      rangeStart = past.toISOString().slice(0, 10)
      rangeEnd = now.toISOString().slice(0, 10)
    } else if (selectedTimeframe === 'recent') {
      // Find the most recent commit date
      const latestDateStr = data[data.length - 1][0]
      const latestDate = new Date(latestDateStr)

      // 365 days prior to the latest commit
      const startDate = new Date(latestDate)
      startDate.setDate(startDate.getDate() - 365)

      rangeStart = startDate.toISOString().slice(0, 10)
      rangeEnd = latestDateStr

      filtered = data.filter(([date]) => date >= rangeStart && date <= rangeEnd)
    } else {
      // Specific year selected e.g. "2024"
      rangeStart = `${selectedTimeframe}-01-01`
      rangeEnd = `${selectedTimeframe}-12-31`
      filtered = data.filter(([date]) => date.startsWith(selectedTimeframe))
    }

    const periodCommits = filtered.reduce((acc, cur) => acc + cur[1], 0)
    const activeDays = filtered.length
    const maxDayCommits = filtered.reduce((max, cur) => Math.max(max, cur[1]), 1)

    return {
      range: [rangeStart, rangeEnd],
      filteredData: filtered,
      periodCommits,
      activeDays,
      maxDayCommits,
    }
  }, [data, selectedTimeframe])

  const chartOption = useMemo(() => {
    const isDark = theme === 'dark'

    return {
      backgroundColor: 'transparent',
      tooltip: {
        position: 'top',
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        textStyle: { color: isDark ? '#f8fafc' : '#0f172a' },
        formatter: (p: EChartsHeatmapParam) => {
          const val = p.data
          if (!val) return ''
          const count = val[1]
          const date = val[0]
          return `
            <div style="font-size:12px;padding:3px 6px;color:${isDark ? '#f8fafc' : '#0f172a'};">
              <strong style="color:${isDark ? '#38bdf8' : '#0284c7'};">${count} commit${count === 1 ? '' : 's'}</strong> on ${date}
            </div>
          `
        },
      },
      visualMap: {
        min: 0,
        max: Math.max(4, maxDayCommits),
        calculable: false,
        orient: 'horizontal',
        right: 30,
        bottom: 8,
        itemWidth: 11,
        itemHeight: 11,
        text: ['More', 'Less'],
        textGap: 8,
        textStyle: {
          color: isDark ? '#94a3b8' : '#64748b',
          fontSize: 10,
        },
        inRange: {
          color: isDark
            ? ['#0f172a', '#064e3b', '#059669', '#10b981', '#34d399']
            : ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
        },
      },
      calendar: {
        top: 25,
        left: 40,
        right: 30,
        bottom: 45,
        cellSize: ['auto', 15],
        range: range,
        itemStyle: {
          borderWidth: 2.5,
          borderColor: isDark ? '#020617' : '#ffffff',
          borderRadius: 3,
        },
        yearLabel: { show: false },
        monthLabel: {
          nameMap: 'en',
          color: isDark ? '#94a3b8' : '#64748b',
          fontSize: 11,
        },
        dayLabel: {
          firstDay: 1,
          nameMap: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
          color: isDark ? '#94a3b8' : '#64748b',
          fontSize: 10,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: isDark ? '#1e293b' : '#e2e8f0',
            width: 1.5,
          },
        },
      },
      series: [
        {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: filteredData,
        },
      ],
    }
  }, [range, filteredData, maxDayCommits, theme])

  return (
    <div className="w-full min-h-[260px] rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-5 flex flex-col relative shadow-xs">
      {/* Header with Title and Timeframe Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              Commit Activity Heatmap
            </h3>
            <span className="text-xs text-slate-400">&bull;</span>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              <span className="tabular-nums font-mono font-semibold text-slate-900 dark:text-white">{periodCommits}</span> commit{periodCommits === 1 ? '' : 's'} in selected period (<span className="tabular-nums font-mono">{data.reduce((a, b) => a + b[1], 0)}</span> total)
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500 dark:text-amber-400" aria-hidden="true" />
              <span className="tabular-nums font-mono">{activeDays}</span> active day{activeDays === 1 ? '' : 's'}
            </span>
            <span>&bull;</span>
            <span>Max <span className="tabular-nums font-mono">{maxDayCommits}</span> commits / day</span>
          </div>
        </div>

        {/* Year / Window Selector Pills */}
        {availableYears.length > 0 && (
          <div
            role="group"
            aria-label="Commit activity timeframe filters"
            className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-1 rounded-xl self-start sm:self-auto overflow-x-auto max-w-full"
          >
            <button
              type="button"
              onClick={() => setSelectedTimeframe('recent')}
              aria-pressed={selectedTimeframe === 'recent'}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                selectedTimeframe === 'recent'
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 font-semibold shadow-xs shadow-emerald-600/20 dark:shadow-emerald-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              Recent (12M)
            </button>

            {availableYears.map((year) => (
              <button
                type="button"
                key={year}
                onClick={() => setSelectedTimeframe(year)}
                aria-pressed={selectedTimeframe === year}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  selectedTimeframe === year
                    ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 font-semibold shadow-xs shadow-emerald-600/20 dark:shadow-emerald-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chart Canvas */}
      <div
        role="region"
        aria-label="Commit activity calendar heatmap"
        className="flex-1 w-full min-h-[170px]"
      >
        <ReactECharts
          option={chartOption}
          style={{ width: '100%', height: '170px' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </div>
  )
}
