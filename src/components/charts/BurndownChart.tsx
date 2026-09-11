import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { useTheme } from '../../context/ThemeContext'

interface BurndownChartProps {
  dates: string[]
  openedIssues: number[]
  closedIssues: number[]
}

export const BurndownChart: React.FC<BurndownChartProps> = ({
  dates,
  openedIssues,
  closedIssues,
}) => {
  const { theme } = useTheme()

  const chartOption = useMemo(() => {
    const isDark = theme === 'dark'

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        textStyle: { color: isDark ? '#f8fafc' : '#0f172a' },
      },
      legend: {
        data: ['Opened Issues', 'Closed Issues'],
        textStyle: { color: isDark ? '#94a3b8' : '#64748b' },
        top: 0,
        right: 10,
      },
      grid: {
        top: 40,
        left: 45,
        right: 25,
        bottom: 50,
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: { lineStyle: { color: isDark ? '#334155' : '#cbd5e1' } },
        axisLabel: { color: isDark ? '#94a3b8' : '#64748b', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: isDark ? '#1e293b' : '#f1f5f9' } },
        axisLabel: { color: isDark ? '#94a3b8' : '#64748b', fontSize: 11 },
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
        {
          type: 'slider',
          start: 0,
          end: 100,
          height: 20,
          bottom: 10,
          borderColor: isDark ? '#334155' : '#cbd5e1',
          fillerColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
          handleStyle: { color: '#10b981' },
          textStyle: { color: isDark ? '#94a3b8' : '#64748b' },
        },
      ],
      series: [
        {
          name: 'Opened Issues',
          type: 'bar',
          data: openedIssues,
          itemStyle: {
            color: '#f43f5e',
            borderRadius: [4, 4, 0, 0],
          },
        },
        {
          name: 'Closed Issues',
          type: 'bar',
          data: closedIssues,
          itemStyle: {
            color: '#10b981',
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
    }
  }, [dates, openedIssues, closedIssues, theme])

  return (
    <div className="w-full h-[340px] rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 flex flex-col relative shadow-xs">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
            Issue Burndown & Backlog Health
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Intake of new issues vs resolved tickets across project releases
          </p>
        </div>
      </div>
      <div
        role="region"
        aria-label="Issue burndown and backlog resolution chart"
        className="flex-1 w-full min-h-0"
      >
        <ReactECharts
          option={chartOption}
          style={{ width: '100%', height: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </div>
  )
}
