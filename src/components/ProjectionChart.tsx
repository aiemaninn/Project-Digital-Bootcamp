import React, { useState } from "react";
import { QuarterlyProjection } from "../types";
import { Info, HelpCircle } from "lucide-react";

interface ProjectionChartProps {
  projections: QuarterlyProjection[];
}

export const ProjectionChart: React.FC<ProjectionChartProps> = ({ projections }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Chart dimensions & scaling
  const width = 760;
  const height = 300;
  const padding = { top: 30, right: 30, bottom: 45, left: 55 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Min and max bounds for y-axis
  const minY = 1.0;
  const maxY = 5.5; // Up to regulatory threshold and beyond

  const getX = (index: number) => {
    if (projections.length <= 1) return padding.left;
    return padding.left + (index / (projections.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    const clamped = Math.max(minY, Math.min(maxY, val));
    return padding.top + chartHeight - ((clamped - minY) / (maxY - minY)) * chartHeight;
  };

  // Build SVG path strings
  const baselinePath = projections
    .map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(p.baseline)}`)
    .join(" ");

  const sentimentPath = projections
    .map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(p.sentimentAdjusted)}`)
    .join(" ");

  const modStressPath = projections
    .map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(p.moderateStress)}`)
    .join(" ");

  const sevStressPath = projections
    .map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(p.severeStress)}`)
    .join(" ");

  // CI Fan Area (Confidence Interval Band for sentimentAdjusted)
  const ciAreaPath =
    projections.map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(p.ciUpper)}`).join(" ") +
    " " +
    projections
      .slice()
      .reverse()
      .map((p, i) => `L ${getX(projections.length - 1 - i)} ${getY(p.ciLower)}`)
      .join(" ") +
    " Z";

  // Threshold 5.0% line
  const thresholdY = getY(5.0);
  const safeLimitY = getY(2.5);

  const activePoint = hoveredIndex !== null ? projections[hoveredIndex] : projections[0];

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            Lintasan Nowcast & Forecast NPL (Multi-Kuartal)
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Model MIDAS + Fan Chart 95% CI
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Proyeksi transmisi dinamik guncangan sentimen berita dan skenario makroekonomi BI
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
            <span className="text-slate-700 font-medium">Nowcast Aktif</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-blue-100 border border-blue-300 inline-block"></span>
            <span className="text-slate-500">Pita CI 95%</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-slate-400 inline-block"></span>
            <span className="text-slate-500">Baseline OJK</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-amber-500 border-b border-dashed border-amber-500 inline-block"></span>
            <span className="text-amber-700">Stres Moderat</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-rose-500 border-b border-dashed border-rose-500 inline-block"></span>
            <span className="text-rose-700">Stres Berat</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[320px] select-none font-sans"
        >
          {/* Background Grid & Axis */}
          {[1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0].map((tick) => (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={getY(tick)}
                x2={width - padding.right}
                y2={getY(tick)}
                stroke={tick === 5.0 ? "#f43f5e" : tick === 2.5 ? "#10b981" : "#f1f5f9"}
                strokeWidth={tick === 5.0 || tick === 2.5 ? 1.5 : 1}
                strokeDasharray={tick === 5.0 || tick === 2.5 ? "4 3" : undefined}
              />
              <text
                x={padding.left - 10}
                y={getY(tick) + 4}
                textAnchor="end"
                className={`text-[11px] font-mono ${
                  tick === 5.0
                    ? "fill-rose-600 font-bold"
                    : tick === 2.5
                    ? "fill-emerald-600 font-bold"
                    : "fill-slate-400"
                }`}
              >
                {tick.toFixed(1)}%
              </text>
            </g>
          ))}

          {/* Regulatory Threshold Badges */}
          <text
            x={width - padding.right}
            y={thresholdY - 6}
            textAnchor="end"
            className="text-[10px] font-bold fill-rose-600"
          >
            Ambang Batas Regulator BI / OJK (5.0%)
          </text>
          <text
            x={width - padding.right}
            y={safeLimitY - 6}
            textAnchor="end"
            className="text-[10px] font-bold fill-emerald-600"
          >
            Batas Zona Aman (2.5%)
          </text>

          {/* 95% Confidence Interval Area */}
          <path d={ciAreaPath} fill="#93c5fd" fillOpacity="0.22" />

          {/* Scenario Lines */}
          <path d={baselinePath} fill="none" stroke="#94a3b8" strokeWidth="2" />
          <path
            d={modStressPath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="5 3"
          />
          <path
            d={sevStressPath}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="5 3"
          />
          <path
            d={sentimentPath}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Interactive vertical hover indicator line */}
          {hoveredIndex !== null && (
            <line
              x1={getX(hoveredIndex)}
              y1={padding.top}
              x2={getX(hoveredIndex)}
              y2={height - padding.bottom}
              stroke="#64748b"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          )}

          {/* Data Points for Nowcast / Sentiment-adjusted */}
          {projections.map((p, i) => {
            const cx = getX(i);
            const cy = getY(p.sentimentAdjusted);
            const isHovered = hoveredIndex === i;

            return (
              <g
                key={p.quarter}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Hit area */}
                <circle cx={cx} cy={cy} r="18" fill="transparent" />
                {/* Pulse halo if hovered */}
                {isHovered && (
                  <circle cx={cx} cy={cy} r="10" fill="#3b82f6" fillOpacity="0.3" />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? "6" : "4.5"}
                  fill="#1d4ed8"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                />
                {/* Point value label */}
                <text
                  x={cx}
                  y={cy - 10}
                  textAnchor="middle"
                  className="text-[11px] font-bold fill-blue-900 font-mono"
                >
                  {p.sentimentAdjusted.toFixed(2)}%
                </text>

                {/* X-axis tick label */}
                <text
                  x={cx}
                  y={height - padding.bottom + 20}
                  textAnchor="middle"
                  className={`text-[11px] ${
                    isHovered ? "fill-blue-700 font-bold" : "fill-slate-600 font-medium"
                  }`}
                >
                  {p.quarter.split(" ")[0]}
                </text>
                <text
                  x={cx}
                  y={height - padding.bottom + 34}
                  textAnchor="middle"
                  className="text-[9px] fill-slate-400"
                >
                  {p.quarter.split(" ").slice(1).join(" ")}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive Tooltip Card */}
      <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="font-semibold text-slate-800">
            Fokus Kuartal: <span className="text-blue-700 font-bold">{activePoint.quarter}</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500">Sentimen-Adjusted: </span>
            <span className="font-bold text-blue-700">{activePoint.sentimentAdjusted.toFixed(2)}%</span>
          </div>
          <div>
            <span className="text-slate-500">Rentang 95% CI: </span>
            <span className="font-semibold text-slate-700">
              [{activePoint.ciLower.toFixed(2)}% - {activePoint.ciUpper.toFixed(2)}%]
            </span>
          </div>
          <div>
            <span className="text-slate-500">Stres Moderat: </span>
            <span className="font-semibold text-amber-700">{activePoint.moderateStress.toFixed(2)}%</span>
          </div>
          <div>
            <span className="text-slate-500">Stres Berat: </span>
            <span className="font-semibold text-rose-700">{activePoint.severeStress.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
