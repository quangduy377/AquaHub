import { formatShortDate } from "../../../utils/dateUtils";
import type { ChartParameter, WaterReading } from "../types/aquarium";
import styles from "./ParameterChart.module.css";

export default function ParameterChart({ readings, parameter, color, unit }: {
  readings: WaterReading[];
  parameter: ChartParameter;
  color: string;
  unit: string;
}) {
  const data = [...readings].reverse().slice(-8);
  const values = data.map((reading) => reading[parameter]);
  const width = 420;
  const height = 190;
  const plotLeft = 48;
  const plotRight = 10;
  const plotTop = 12;
  const plotBottom = 145;
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const range = maximum - minimum || Math.max(maximum * 0.2, 1);
  const lowerBound = Math.max(0, minimum - range * 0.2);
  const upperBound = maximum + range * 0.2;
  const chartRange = upperBound - lowerBound || 1;
  const points = values.map((value, index) => ({
    x: data.length === 1 ? (plotLeft + width - plotRight) / 2 : plotLeft + index * ((width - plotLeft - plotRight) / (data.length - 1)),
    y: plotTop + (upperBound - value) * ((plotBottom - plotTop) / chartRange),
    value,
  }));
  const yTicks = [upperBound, (upperBound + lowerBound) / 2, lowerBound];
  const linePoints = points.map(({ x, y }) => `${x},${y}`).join(" ");
  const lastPoint = points[points.length - 1];
  const areaPoints = points.length > 1
    ? `${points[0].x},${plotBottom} ${linePoints} ${lastPoint.x},${plotBottom}`
    : "";

  return (
    <div className={styles.chartBody}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${parameter} readings over time`}>
        {yTicks.map((tick, index) => {
          const y = plotTop + index * ((plotBottom - plotTop) / (yTicks.length - 1));
          const label = chartRange < 2 ? tick.toFixed(2) : tick.toFixed(1).replace(".0", "");
          return <g key={index}>
            <line className={styles.gridLine} x1={plotLeft} x2={width - plotRight} y1={y} y2={y} />
            <text className={styles.axisTick} x={plotLeft - 8} y={y + 4} textAnchor="end">{label}</text>
          </g>;
        })}
        <line className={styles.axisLine} x1={plotLeft} x2={plotLeft} y1={plotTop} y2={plotBottom} />
        <line className={styles.axisLine} x1={plotLeft} x2={width - plotRight} y1={plotBottom} y2={plotBottom} />
        {points.length > 1 && <polygon points={areaPoints} fill={color} opacity="0.08" />}
        {points.length > 1 && <polyline points={linePoints} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
        {points.map(({ x, y, value }, index) => (
          <g key={`${data[index].id}-${parameter}`}>
            <circle cx={x} cy={y} r="7" fill="#fff" stroke={color} strokeWidth="3" />
            <title>{`${formatShortDate(data[index].recordedAt)}: ${value}${unit ? ` ${unit}` : ""}`}</title>
            <line className={styles.tickMark} x1={x} x2={x} y1={plotBottom} y2={plotBottom + 5} />
            <text className={styles.axisTick} x={x} y={plotBottom + 17} textAnchor="middle">{formatShortDate(data[index].recordedAt)}</text>
          </g>
        ))}
        <text className={styles.axisTitle} x={(plotLeft + width - plotRight) / 2} y={height - 4} textAnchor="middle">Test date</text>
        <text className={styles.axisTitle} x="11" y={(plotTop + plotBottom) / 2} textAnchor="middle" transform={`rotate(-90 11 ${(plotTop + plotBottom) / 2})`}>
          {unit ? `Value (${unit})` : "Value"}
        </text>
      </svg>
    </div>
  );
}
