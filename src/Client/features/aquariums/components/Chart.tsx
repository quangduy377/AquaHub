
import type { ChartParameter, WaterReading } from "../types/aquarium";
import styles from "./Chart.module.css";
import ParameterChart from "./ParameterChart";

//TODO: Refactor the key
type ChartProps = {
    readings: WaterReading[],
    // key: keyof (Omit<ReadingForm, "note">),
    config: { key: ChartParameter; label: string; formula: string; unit: string; color: string }
}

// const chartMeta: { key: ChartParameter; label: string; formula: string; unit: string; color: string }[] = [
//     { key: "ammonia", label: "Ammonia", formula: "NH3", unit: "ppm", color: "#d97706" },
//     { key: "nitrite", label: "Nitrite", formula: "NO2", unit: "ppm", color: "#dc5a65" },
//     { key: "nitrate", label: "Nitrate", formula: "NO3", unit: "ppm", color: "#8b5cf6" },
//     { key: "ph", label: "Acidity", formula: "pH", unit: "", color: "#16836f" },
//     { key: "tds", label: "Total dissolved solids", formula: "TDS", unit: "ppm", color: "#2081c3" },
// ];


export default function Chart({ readings, config }: ChartProps) {
    //Latest record is indexed by 0
    const latest = readings[0];
    const currentValue = latest?.[config["key"]];
    const previousValue = readings[1]?.[config["key"]];

    const difference = currentValue !== undefined && previousValue !== undefined
        ? Number((currentValue - previousValue).toFixed(2))
        : null;
    //{chartMeta.map(({ key, label, formula, unit, color }) => {
    return (<article className={styles.chartCard} key={config.key}>
        <div className={styles.chartHeader}>
            <div><span>{config.label}</span><h3 style={{ color: config.color }}>{config.formula}</h3></div>
            <div className={styles.chartCurrent}>
                <strong>{currentValue ?? "--"} <small>{config.unit}</small></strong>
                {difference !== null && (
                    <span className={difference > 0 ? styles.trendUp : difference < 0 ? styles.trendDown : styles.trendStable}>
                        {difference > 0 ? "+" : difference < 0 ? "-" : ""}{Math.abs(difference)} since last
                    </span>
                )}
            </div>
        </div>
        {readings.length > 0
            ? <ParameterChart readings={readings} parameter={config.key} color={config.color} unit={config.unit} />
            : <div className={styles.chartEmpty}>Add a test to start this chart.</div>}
    </article>);
}
