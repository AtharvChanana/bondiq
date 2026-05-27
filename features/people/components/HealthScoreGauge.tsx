"use client"

import { RadialBar, RadialBarChart } from "recharts"

import { getHealthColor } from "@/shared/constants/health-score"

export function HealthScoreGauge({ score, size = 72 }: { score: number; size?: number }) {
  const data = [{ name: "health", value: score, fill: getHealthColor(score) }]

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <RadialBarChart
        width={size}
        height={size}
        innerRadius={size / 3}
        outerRadius={size / 2}
        data={data}
        startAngle={90}
        endAngle={90 - (score / 100) * 360}
      >
        <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "var(--muted)" }} />
      </RadialBarChart>
      <span className="absolute text-sm font-semibold">{score}</span>
    </div>
  )
}
