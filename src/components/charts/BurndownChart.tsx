import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'

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
        data: ['Opened Issues', 'Closed Issues'],
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
          fillerColor: 'rgba(16, 185, 129, 0.15)',
          handleStyle: { color: '#10b981' },
          textStyle: { color: '#94a3b8' },
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
  }, [dates, openedIssues, closedIssues])

  return (
    <div className="w-full h-[340px] rounded-2xl bg-slate-900/60 border border-slate-800 p-4 flex flex-col relative">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Issue Burndown & Backlog Health
          </h3>
          <p className="text-xs text-slate-400">
            Intake of new issues vs resolved tickets across project releases
          </p>
        </div>
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
