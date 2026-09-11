import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { useTheme } from '../../context/ThemeContext'

interface VelocityChartProps {
  dates: string[]
  openedPRs: number[]
  mergedPRs: number[]
}

export const VelocityChart: React.FC<VelocityChartProps> = ({
  dates,
  openedPRs,
  mergedPRs,
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
        data: ['Opened PRs', 'Merged PRs'],
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
          fillerColor: isDark ? 'rgba(6, 182, 212, 0.15)' : 'rgba(6, 182, 212, 0.1)',
          handleStyle: { color: '#06b6d4' },
          textStyle: { color: isDark ? '#94a3b8' : '#64748b' },
        },
      ],
      series: [
        {
          name: 'Opened PRs',
          type: 'line',
          smooth: true,
          data: openedPRs,
          lineStyle: { color: '#f59e0b', width: 2.5 },
          itemStyle: { color: '#f59e0b' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(245, 158, 11, 0.25)' },
                { offset: 1, color: 'rgba(245, 158, 11, 0.0)' },
              ],
            },
          },
        },
        {
          name: 'Merged PRs',
          type: 'line',
          smooth: true,
          data: mergedPRs,
          lineStyle: { color: '#06b6d4', width: 2.5 },
          itemStyle: { color: '#06b6d4' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(6, 182, 212, 0.3)' },
                { offset: 1, color: 'rgba(6, 182, 212, 0.0)' },
              ],
            },
          },
        },
      ],
    }
  }, [dates, openedPRs, mergedPRs, theme])

  return (
    <div className="w-full h-[340px] rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 flex flex-col relative shadow-xs">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
            Pull Request Velocity & Throughput
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monthly rate of opened pull requests vs successfully merged contributions
          </p>
        </div>
      </div>
      <div
        role="region"
        aria-label="Pull request velocity and merge throughput chart"
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
