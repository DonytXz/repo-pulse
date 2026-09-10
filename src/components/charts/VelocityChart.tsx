import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'

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
  const chartOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        textStyle: { color: '#f8fafc' },
      },
      legend: {
        data: ['Opened PRs', 'Merged PRs'],
        textStyle: { color: '#94a3b8' },
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
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#1e293b' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
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
          borderColor: '#334155',
          fillerColor: 'rgba(6, 182, 212, 0.15)',
          handleStyle: { color: '#06b6d4' },
          textStyle: { color: '#94a3b8' },
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
  }, [dates, openedPRs, mergedPRs])

  return (
    <div className="w-full h-[340px] rounded-2xl bg-slate-900/60 border border-slate-800 p-4 flex flex-col relative">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Pull Request Velocity & Throughput
          </h3>
          <p className="text-xs text-slate-400">
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
