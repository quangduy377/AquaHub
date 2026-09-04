
import type { ChartParameter, WaterReading } from "../types/aquarium";
import styles from "./Chart.module.css";
import ParameterChart from "./ParameterChart";

type ChartProps = {
    readings: WaterReading[],
    config: { key: ChartParameter; label: string; formula: string; unit: string; color: string }
}

const KEY = "key";
export default function Chart({ readings, config }: ChartProps) {
    //Latest record is indexed by 0
    const latest = readings[0];
    const currentValue = latest?.[config[KEY]];
    const previousValue = readings[1]?.[config[KEY]];
    const difference = currentValue !== undefined && previousValue !== undefined
        ? Number((currentValue - previousValue).toFixed(2))
        : null;

    return (<article className={styles.chartCard} key={config[KEY]}>
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
            ? <ParameterChart readings={readings} parameter={config[KEY]} color={config.color} unit={config.unit} />
            : <div className={styles.chartEmpty}>Add a test to start this chart.</div>}
    </article>);
}
