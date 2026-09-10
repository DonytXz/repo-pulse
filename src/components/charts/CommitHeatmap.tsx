import React, { useState, useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { Calendar, Flame } from 'lucide-react'

interface CommitHeatmapProps {
  data: Array<[string, number]> // [YYYY-MM-DD, count]
}

export const CommitHeatmap: React.FC<CommitHeatmapProps> = ({ data }) => {
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
    return {
      backgroundColor: 'transparent',
      tooltip: {
        position: 'top',
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        textStyle: { color: '#f8fafc' },
        formatter: (p: any) => {
          const val = p.data
          if (!val) return ''
          const count = val[1]
          const date = val[0]
          return `
            <div style="font-size:12px;padding:3px 6px;">
              <strong style="color:#38bdf8;">${count} commit${count === 1 ? '' : 's'}</strong> on ${date}
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
          color: '#64748b',
          fontSize: 10,
        },
        inRange: {
          color: ['#0f172a', '#064e3b', '#059669', '#10b981', '#34d399'],
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
          borderColor: '#020617',
          borderRadius: 3,
        },
        yearLabel: { show: false },
        monthLabel: {
          nameMap: 'en',
          color: '#94a3b8',
          fontSize: 11,
        },
        dayLabel: {
          firstDay: 1,
          nameMap: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
          color: '#64748b',
          fontSize: 10,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#1e293b',
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
  }, [range, filteredData, maxDayCommits])

  return (
    <div className="w-full min-h-[260px] rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col relative">
      {/* Header with Title and Timeframe Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Commit Activity Heatmap
            </h3>
            <span className="text-xs text-slate-500">&bull;</span>
            <span className="text-xs text-slate-400">
              {periodCommits} commit{periodCommits === 1 ? '' : 's'} in selected period ({data.reduce((a, b) => a + b[1], 0)} total)
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" />
              {activeDays} active day{activeDays === 1 ? '' : 's'}
            </span>
            <span>&bull;</span>
            <span>Max {maxDayCommits} commits / day</span>
          </div>
        </div>

        {/* Year / Window Selector Pills */}
        {availableYears.length > 0 && (
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 p-1 rounded-xl self-start sm:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setSelectedTimeframe('recent')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedTimeframe === 'recent'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-xs shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Recent (12M)
            </button>

            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedTimeframe(year)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedTimeframe === year
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-xs shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 w-full min-h-[170px]">
        <ReactECharts
          option={chartOption}
          style={{ width: '100%', height: '170px' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </div>
  )
}
