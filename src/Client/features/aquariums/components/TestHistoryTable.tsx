import { formatDate } from "../../../utils/dateUtils";
import { getReadingStatus } from "../../../utils/statusUtils";
import type { WaterReading } from "../types/aquarium";
import styles from "./TestHistoryTable.module.css";
import { parameterMeta } from "../types/aquarium";
type TestHistoryProps = {
    history: WaterReading[],
}

export default function TestHistoryTable({ history }: TestHistoryProps) {
    return (
        <table className={styles.table}>
            <thead><tr><th>Date</th><th>Status</th><th>pH</th><th>Temp.</th><th>NH₃</th><th>NO₂</th><th>NO₃</th><th>TDS</th><th>Note</th></tr></thead>
            <tbody>{history.map((reading) => {
                const status = getReadingStatus(parameterMeta, reading);
                return <tr key={reading.id}>
                    <td>{formatDate(reading.recordedAt)}</td>
                    <td><span className={`${styles.statusBadge} ${styles[status.toLowerCase()]}`}><i />{status}</span></td>
                    <td>{reading.ph}</td><td>{reading.temperature}°</td><td>{reading.ammonia}</td><td>{reading.nitrite}</td><td>{reading.nitrate}</td><td>{reading.tds}</td>
                    <td className={styles.noteCell}>{reading.note || "—"}</td>
                </tr>;
            })}</tbody>
        </table>);
}
