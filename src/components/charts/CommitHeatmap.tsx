import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'

interface CommitHeatmapProps {
  data: Array<[string, number]> // [YYYY-MM-DD, count]
}

export const CommitHeatmap: React.FC<CommitHeatmapProps> = ({ data }) => {
  const chartOption = useMemo(() => {
    // Determine date range for calendar
    let startDate = new Date()
    let endDate = new Date()

    if (data.length > 0) {
      startDate = new Date(data[0][0])
      endDate = new Date(data[data.length - 1][0])
    } else {
      startDate.setDate(endDate.getDate() - 90)
    }

    // Default to at least the last 90-120 days
    const rangeStart = startDate.toISOString().slice(0, 10)
    const rangeEnd = endDate.toISOString().slice(0, 10)

    const maxCommit = data.reduce((max, cur) => Math.max(max, cur[1]), 1)

    return {
      backgroundColor: 'transparent',
      tooltip: {
        position: 'top',
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        textStyle: { color: '#f8fafc' },
        formatter: (p: any) => {
          const value = p.data
          return `
            <div style="font-size:12px;padding:2px 4px;">
              <b>${value[1]} commits</b> on ${value[0]}
            </div>
          `
        },
      },
      visualMap: {
        min: 0,
        max: Math.max(5, maxCommit),
        calculable: false,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        inRange: {
          color: ['#0f172a', '#064e3b', '#059669', '#10b981', '#34d399'],
        },
        textStyle: {
          color: '#94a3b8',
          fontSize: 11,
        },
      },
      calendar: {
        top: 25,
        left: 30,
        right: 30,
        cellSize: ['auto', 16],
        range: [rangeStart, rangeEnd],
        itemStyle: {
          borderWidth: 2,
          borderColor: '#020617',
          borderRadius: 2,
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
            width: 1,
          },
        },
      },
      series: [
        {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: data,
        },
      ],
    }
  }, [data])

  return (
    <div className="w-full h-[220px] rounded-2xl bg-slate-900/60 border border-slate-800 p-4 flex flex-col relative">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-white tracking-tight">
          Commit Activity Heatmap
        </h3>
        <span className="text-xs text-slate-400">
          Total commits recorded: {data.reduce((acc, cur) => acc + cur[1], 0)}
        </span>
      </div>
      <div className="flex-1 w-full min-h-0">
        <ReactECharts
          option={chartOption}
          style={{ width: '100%', height: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </div>
  )
}
