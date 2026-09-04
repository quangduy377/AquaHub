import styles from "./ParameterCard.module.css";
import type { ParameterMeta, WaterReading } from "../types/aquarium";
import { getParameterStatus } from "../../../utils/statusUtils";
type ParameterProps = {
    reading: WaterReading,
    parameterInfo: ParameterMeta
}
export default function ParameterCard({ reading, parameterInfo }: ParameterProps) {
    const { key, label, unit, ideal } = parameterInfo;
    const status = getParameterStatus(key, reading[key]);
    return (
        <article className={styles.parameterCard} key={key}>
            <div className={styles.parameterHeader}><span>{label}</span><i className={`${styles.miniDot} ${styles[status.toLowerCase()]}`} /></div>
            <div className={styles.parameterValue}>{reading[key]} <small>{unit}</small></div>
            <div className={styles.parameterFooter}><span>Ideal {ideal}</span><strong className={styles[status.toLowerCase()]}>{status}</strong></div>
        </article>
    );

}
