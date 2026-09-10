import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import type { NetworkNode, NetworkLink } from '../../api/types'

interface ContributorGraphProps {
  nodes: NetworkNode[]
  links: NetworkLink[]
  categories: Array<{ name: string }>
  highlightedUser?: string
  onSelectContributor?: (login: string) => void
}

interface EChartsNodeParams {
  dataType?: string
  data: {
    id?: string
    name?: string
    value?: number
    source?: string
    target?: string
  }
}

export const ContributorGraph: React.FC<ContributorGraphProps> = ({
  nodes,
  links,
  categories,
  highlightedUser,
  onSelectContributor,
}) => {
  const chartOption = useMemo(() => {
    const formattedNodes = nodes.map((n) => {
      const isHighlighted = highlightedUser && n.id === highlightedUser
      return {
        id: n.id,
        name: n.name,
        value: n.value,
        category: n.category,
        symbolSize: isHighlighted ? n.symbolSize * 1.3 : n.symbolSize,
        itemStyle: isHighlighted
          ? {
              borderColor: '#38bdf8',
              borderWidth: 4,
              shadowBlur: 20,
              shadowColor: '#38bdf8',
            }
          : undefined,
      }
    })

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        textStyle: { color: '#f8fafc' },
        formatter: (params: EChartsNodeParams) => {
          if (params.dataType === 'node') {
            const node = nodes.find((n) => n.id === params.data.id)
            const cat = categories[node?.category ?? 3]?.name || 'Contributor'
            return `
              <div style="display:flex;align-items:center;gap:8px;padding:4px 0;">
                <img src="${node?.avatar}" style="width:28px;height:28px;border-radius:50%;border:1px solid #475569" />
                <div>
                  <div style="font-weight:600;font-size:13px;">${params.data.name}</div>
                  <div style="font-size:11px;color:#94a3b8;">${cat} &bull; ${params.data.value} contributions</div>
                </div>
              </div>
            `
          } else if (params.dataType === 'edge') {
            return `
              <div style="font-size:12px;padding:2px;">
                Collaboration link: <b>${params.data.source}</b> &harr; <b>${params.data.target}</b>
                <div style="color:#94a3b8;font-size:11px;margin-top:2px;">Co-authorship / PR weight: ${params.data.value}</div>
              </div>
            `
          }
          return ''
        },
      },
      legend: [
        {
          data: categories.map((a) => a.name),
          textStyle: { color: '#94a3b8', fontSize: 12 },
          bottom: 10,
          orient: 'horizontal',
        },
      ],
      color: ['#06b6d4', '#8b5cf6', '#ec4899', '#3b82f6'],
      series: [
        {
          name: 'Contributors',
          type: 'graph',
          layout: 'force',
          data: formattedNodes,
          links: links.map((l) => ({
            source: l.source,
            target: l.target,
            value: l.value,
            lineStyle: {
              width: Math.max(1, Math.min(6, l.value * 0.8)),
              curveness: 0.1,
              opacity: 0.45,
            },
          })),
          categories: categories,
          roam: true,
          label: {
            show: true,
            position: 'right',
            formatter: '{b}',
            color: '#cbd5e1',
            fontSize: 11,
          },
          force: {
            repulsion: 260,
            gravity: 0.12,
            edgeLength: [60, 140],
            friction: 0.6,
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 4,
              opacity: 0.9,
            },
          },
        },
      ],
    }
  }, [nodes, links, categories, highlightedUser])

  const onEvents = useMemo(
    () => ({
      click: (params: EChartsNodeParams) => {
        if (params.dataType === 'node' && onSelectContributor && params.data.id) {
          onSelectContributor(params.data.id)
        }
      },
    }),
    [onSelectContributor]
  )

  return (
    <div className="w-full h-[520px] rounded-2xl bg-slate-900/60 border border-slate-800 p-4 flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Contributor Collaboration Network
          </h3>
          <p className="text-xs text-slate-400">
            Force-directed graph highlighting maintainers, community clusters, and co-authorship
          </p>
        </div>
        <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
          Pan &bull; Zoom &bull; Drag nodes &bull; Click to filter
        </span>
      </div>

      <div
        role="region"
        aria-label="Interactive Contributor Collaboration Network graph"
        className="flex-1 w-full min-h-0"
      >
        <ReactECharts
          option={chartOption}
          onEvents={onEvents}
          style={{ width: '100%', height: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </div>
  )
}
