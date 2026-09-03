import { useState } from "react";
import styles from "./AquariumWaterQualityPage.module.css";
import { formatDate } from "../../../utils/dateUtils";
import type { HistoryFilter, ChartParameter, WaterReading, Aquarium } from "../types/aquarium";
import { parameterMeta } from "../types/aquarium";
import { getReadingStatus, getParameterStatus } from "../../../utils/statusUtils";
import ParameterChart from "../components/ParameterChart";
import WaterQualityInputModal from "../components/WaterQualityInputModal";


//TODO: Remove later once we can get aquariums through API endpoints
const aquariums: Aquarium[] = [
  { id: 1, name: "Living Room Planted", type: "Planted", volumeLitres: 120, ph: 5, gh: 5, tds: 100 },
  { id: 2, name: "Crystal Shrimp", type: "Caridina", volumeLitres: 45, ph: 5, gh: 5, tds: 100 },
];

//TODO: Remove this later, not needed
const initialReadings: Record<number, WaterReading[]> = {
  1: [
    { id: 3, recordedAt: "2026-08-31T09:15:00", ph: 7.1, temperature: 25.2, ammonia: 0, nitrite: 0, nitrate: 12, gh: 7, kh: 4, tds: 178, note: "After weekly water change" },
    { id: 2, recordedAt: "2026-08-28T18:30:00", ph: 7.3, temperature: 26.1, ammonia: 0, nitrite: 0.15, nitrate: 18, gh: 7, kh: 4, tds: 186, note: "Fed heavier than usual" },
    { id: 1, recordedAt: "2026-08-24T10:00:00", ph: 7.2, temperature: 25.5, ammonia: 0, nitrite: 0, nitrate: 15, gh: 7, kh: 4, tds: 181, note: "Routine test" },
  ],
  2: [
    { id: 4, recordedAt: "2026-08-30T11:20:00", ph: 6.5, temperature: 23.5, ammonia: 0, nitrite: 0, nitrate: 8, gh: 5, kh: 1, tds: 128, note: "Parameters stable" },
  ],
};


const chartMeta: { key: ChartParameter; label: string; formula: string; unit: string; color: string }[] = [
  { key: "ammonia", label: "Ammonia", formula: "NH3", unit: "ppm", color: "#d97706" },
  { key: "nitrite", label: "Nitrite", formula: "NO2", unit: "ppm", color: "#dc5a65" },
  { key: "nitrate", label: "Nitrate", formula: "NO3", unit: "ppm", color: "#8b5cf6" },
  { key: "ph", label: "Acidity", formula: "pH", unit: "", color: "#16836f" },
  { key: "tds", label: "Total dissolved solids", formula: "TDS", unit: "ppm", color: "#2081c3" },
];


function AquariumWaterQuality() {
  const [selectedAquariumId, setSelectedAquariumId] = useState(1);
  const [readings, setReadings] = useState(initialReadings);
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  //TODO: Get aquariums from the API endpoint
  const aquarium = aquariums.find((item) => item.id === selectedAquariumId) ?? aquariums[0];
  const aquariumReadings = readings[selectedAquariumId] ?? [];
  const latest = aquariumReadings[0];
  const latestStatus = latest ? getReadingStatus(parameterMeta, latest) : "Attention";
  const filteredHistory = aquariumReadings.filter(
    (reading) => historyFilter === "All" || getReadingStatus(parameterMeta, reading) === historyFilter,
  );

  function submitReading(newReading: WaterReading): void {
    console.log("new reading", newReading);
    setReadings((current) => ({
      ...current,
      [selectedAquariumId]: [newReading, ...(current[selectedAquariumId] ?? [])],
    }));
    setIsFormOpen(false);
    setSaveMessage("Water test saved successfully.");
  }

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>Aquarium health</span>
          <h1>Water quality</h1>
          <p>Monitor key parameters and keep your aquarium stable over time.</p>
        </div>
        <div className={styles.heroActions}>
          <label className={styles.aquariumPicker}>
            <span>Aquarium</span>
            <select
              value={selectedAquariumId}
              onChange={(event) => {
                setSelectedAquariumId(Number(event.target.value));
                setHistoryFilter("All");
                setSaveMessage("");
              }}
            >
              {aquariums.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <button className={styles.primaryButton} type="button" onClick={() => setIsFormOpen(true)}>
            + Add water test
          </button>
        </div>
      </header>

      {saveMessage && <div className={styles.toast} role="status">✓ {saveMessage}</div>}

      <section className={styles.overview} aria-label="Water quality overview">
        <div className={styles.tankSummary}>
          <div className={styles.tankIcon} aria-hidden="true">◌</div>
          <div>
            <span className={styles.mutedLabel}>{aquarium.type} aquarium</span>
            <h2>{aquarium.name}</h2>
            <p>{aquarium.volumeLitres} litres · {aquariumReadings.length} recorded tests</p>
          </div>
        </div>
        <div className={`${styles.healthSummary} ${styles[latestStatus.toLowerCase()]}`}>
          <span className={styles.statusDot} />
          <div>
            <span className={styles.mutedLabel}>Current status</span>
            <strong>{latest ? latestStatus : "No data"}</strong>
          </div>
          <small>{latest ? `Last tested ${formatDate(latest.recordedAt)}` : "Add your first water test"}</small>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div><h2>Latest parameters</h2><p>Recommended ranges are general freshwater guidelines.</p></div>
          {latest && <span className={styles.updated}>Updated {formatDate(latest.recordedAt)}</span>}
        </div>

        {latest ? (
          <div className={styles.parameterGrid}>
            {parameterMeta.map(({ key, label, unit, ideal }) => {
              const status = getParameterStatus(key, latest[key]);
              return (
                <article className={styles.parameterCard} key={key}>
                  <div className={styles.parameterHeader}><span>{label}</span><i className={`${styles.miniDot} ${styles[status.toLowerCase()]}`} /></div>
                  <div className={styles.parameterValue}>{latest[key]} <small>{unit}</small></div>
                  <div className={styles.parameterFooter}><span>Ideal {ideal}</span><strong className={styles[status.toLowerCase()]}>{status}</strong></div>
                </article>
              );
            })}
          </div>
        ) : <div className={styles.emptyState}>No readings yet. Add a water test to get started.</div>}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div><h2>Parameter trends</h2><p>Each chart shows up to eight of the most recent water tests.</p></div>
          <span className={styles.chartLegend}><i /> Oldest to newest</span>
        </div>
        <div className={styles.chartGrid}>
          {chartMeta.map(({ key, label, formula, unit, color }) => {
            const currentValue = latest?.[key];
            const previousValue = aquariumReadings[1]?.[key];
            const difference = currentValue !== undefined && previousValue !== undefined
              ? Number((currentValue - previousValue).toFixed(2))
              : null;

            return (
              <article className={styles.chartCard} key={key}>
                <div className={styles.chartHeader}>
                  <div><span>{label}</span><h3 style={{ color }}>{formula}</h3></div>
                  <div className={styles.chartCurrent}>
                    <strong>{currentValue ?? "--"} <small>{unit}</small></strong>
                    {difference !== null && (
                      <span className={difference > 0 ? styles.trendUp : difference < 0 ? styles.trendDown : styles.trendStable}>
                        {difference > 0 ? "+" : difference < 0 ? "-" : ""}{Math.abs(difference)} since last
                      </span>
                    )}
                  </div>
                </div>
                {aquariumReadings.length > 0
                  ? <ParameterChart readings={aquariumReadings} parameter={key} color={color} unit={unit} />
                  : <div className={styles.chartEmpty}>Add a test to start this chart.</div>}
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.historyHeading}>
          <div><h2>Test history</h2><p>Review changes and notes from previous tests.</p></div>
          <div className={styles.filters} aria-label="Filter history">
            {(["All", "Good", "Attention", "Critical"] as HistoryFilter[]).map((filter) => (
              <button key={filter} type="button" className={historyFilter === filter ? styles.activeFilter : ""} onClick={() => setHistoryFilter(filter)}>{filter}</button>
            ))}
          </div>
        </div>

        <div className={styles.tableWrap}>
          {filteredHistory.length > 0 ? (
            <table>
              <thead><tr><th>Date</th><th>Status</th><th>pH</th><th>Temp.</th><th>NH₃</th><th>NO₂</th><th>NO₃</th><th>TDS</th><th>Note</th></tr></thead>
              <tbody>{filteredHistory.map((reading) => {
                const status = getReadingStatus(parameterMeta, reading);
                return <tr key={reading.id}>
                  <td>{formatDate(reading.recordedAt)}</td>
                  <td><span className={`${styles.statusBadge} ${styles[status.toLowerCase()]}`}><i />{status}</span></td>
                  <td>{reading.ph}</td><td>{reading.temperature}°</td><td>{reading.ammonia}</td><td>{reading.nitrite}</td><td>{reading.nitrate}</td><td>{reading.tds}</td>
                  <td className={styles.noteCell}>{reading.note || "—"}</td>
                </tr>;
              })}</tbody>
            </table>
          ) : <div className={styles.emptyState}>No tests match this filter.</div>}
        </div>
      </section>

      {isFormOpen &&
        <WaterQualityInputModal aquarium={aquarium}
          submitReading={submitReading}
          closeForm={() => setIsFormOpen(false)} />
      }
    </main>
  );
}

export default AquariumWaterQuality;
