import { useState, type FormEvent } from "react";
import styles from "./AquariumWaterQualityPage.module.css";

type WaterStatus = "Good" | "Attention" | "Critical";
type HistoryFilter = "All" | WaterStatus;
type ChartParameter = "ammonia" | "nitrite" | "nitrate" | "ph" | "tds";

type WaterReading = {
  id: number;
  recordedAt: string;
  ph: number;
  temperature: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
  gh: number;
  kh: number;
  tds: number;
  note: string;
};

type ReadingForm = Omit<WaterReading, "id" | "recordedAt">;

const aquariums = [
  { id: 1, name: "Living Room Planted", type: "Planted", volume: 120 },
  { id: 2, name: "Crystal Shrimp", type: "Caridina", volume: 45 },
];

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

const emptyForm: ReadingForm = {
  ph: 7,
  temperature: 25,
  ammonia: 0,
  nitrite: 0,
  nitrate: 10,
  gh: 6,
  kh: 3,
  tds: 160,
  note: "",
};

const parameterMeta = [
  { key: "ph", label: "pH", unit: "", ideal: "6.5–7.5" },
  { key: "temperature", label: "Temperature", unit: "°C", ideal: "23–27 °C" },
  { key: "ammonia", label: "Ammonia", unit: "ppm", ideal: "0 ppm" },
  { key: "nitrite", label: "Nitrite", unit: "ppm", ideal: "0 ppm" },
  { key: "nitrate", label: "Nitrate", unit: "ppm", ideal: "< 20 ppm" },
  { key: "gh", label: "GH", unit: "dGH", ideal: "4–8 dGH" },
  { key: "kh", label: "KH", unit: "dKH", ideal: "3–6 dKH" },
  { key: "tds", label: "TDS", unit: "ppm", ideal: "120–220 ppm" },
] as const;

const chartMeta: { key: ChartParameter; label: string; formula: string; unit: string; color: string }[] = [
  { key: "ammonia", label: "Ammonia", formula: "NH3", unit: "ppm", color: "#d97706" },
  { key: "nitrite", label: "Nitrite", formula: "NO2", unit: "ppm", color: "#dc5a65" },
  { key: "nitrate", label: "Nitrate", formula: "NO3", unit: "ppm", color: "#8b5cf6" },
  { key: "ph", label: "Acidity", formula: "pH", unit: "", color: "#16836f" },
  { key: "tds", label: "Total dissolved solids", formula: "TDS", unit: "ppm", color: "#2081c3" },
];

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric" }).format(new Date(value));
}

function ParameterChart({ readings, parameter, color, unit }: {
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

function getParameterStatus(key: keyof ReadingForm, value: number): WaterStatus {
  if (key === "ph") return value < 6 || value > 8.2 ? "Critical" : value < 6.5 || value > 7.5 ? "Attention" : "Good";
  if (key === "temperature") return value < 20 || value > 30 ? "Critical" : value < 23 || value > 27 ? "Attention" : "Good";
  if (key === "ammonia") return value > 0.5 ? "Critical" : value > 0 ? "Attention" : "Good";
  if (key === "nitrite") return value > 0.5 ? "Critical" : value > 0 ? "Attention" : "Good";
  if (key === "nitrate") return value > 40 ? "Critical" : value > 20 ? "Attention" : "Good";
  if (key === "gh") return value < 2 || value > 12 ? "Critical" : value < 4 || value > 8 ? "Attention" : "Good";
  if (key === "kh") return value < 1 || value > 10 ? "Critical" : value < 3 || value > 6 ? "Attention" : "Good";
  if (key === "tds") return value < 70 || value > 350 ? "Critical" : value < 120 || value > 220 ? "Attention" : "Good";
  return "Good";
}

function getReadingStatus(reading: WaterReading): WaterStatus {
  const statuses = parameterMeta.map(({ key }) => getParameterStatus(key, reading[key]));
  if (statuses.includes("Critical")) return "Critical";
  if (statuses.includes("Attention")) return "Attention";
  return "Good";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function AquariumWaterQuality() {
  const [selectedAquariumId, setSelectedAquariumId] = useState(1);
  const [readings, setReadings] = useState(initialReadings);
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<ReadingForm>(emptyForm);
  const [saveMessage, setSaveMessage] = useState("");

  const aquarium = aquariums.find((item) => item.id === selectedAquariumId) ?? aquariums[0];
  const aquariumReadings = readings[selectedAquariumId] ?? [];
  const latest = aquariumReadings[0];
  const latestStatus = latest ? getReadingStatus(latest) : "Attention";
  const filteredHistory = aquariumReadings.filter(
    (reading) => historyFilter === "All" || getReadingStatus(reading) === historyFilter,
  );

  function updateNumber(key: keyof ReadingForm, value: string) {
    setForm((current) => ({ ...current, [key]: Number(value) }));
  }

  function submitReading(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newReading: WaterReading = {
      ...form,
      id: Date.now(),
      recordedAt: new Date().toISOString(),
      note: form.note.trim(),
    };

    setReadings((current) => ({
      ...current,
      [selectedAquariumId]: [newReading, ...(current[selectedAquariumId] ?? [])],
    }));
    setForm(emptyForm);
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
            <p>{aquarium.volume} litres · {aquariumReadings.length} recorded tests</p>
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
                const status = getReadingStatus(reading);
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

      {isFormOpen && (
        <div className={styles.backdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsFormOpen(false)}>
          <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="water-test-title">
            <div className={styles.modalHeader}>
              <div><span className={styles.eyebrow}>New measurement</span><h2 id="water-test-title">Add water test</h2><p>Record the latest parameters for {aquarium.name}.</p></div>
              <button type="button" className={styles.closeButton} aria-label="Close" onClick={() => setIsFormOpen(false)}>×</button>
            </div>
            <form onSubmit={submitReading}>
              <div className={styles.formGrid}>
                {parameterMeta.map(({ key, label, unit }) => (
                  <label className={styles.field} key={key}>
                    <span>{label} {unit && <small>({unit})</small>}</span>
                    <input type="number" min="0" step="0.1" required value={form[key]} onChange={(event) => updateNumber(key, event.target.value)} />
                  </label>
                ))}
                <label className={`${styles.field} ${styles.fullWidth}`}><span>Note <small>(optional)</small></span><textarea rows={3} placeholder="e.g. After a 20% water change" value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} /></label>
              </div>
              <div className={styles.formActions}>
                <button className={styles.cancelButton} type="button" onClick={() => setIsFormOpen(false)}>Cancel</button>
                <button className={styles.primaryButton} type="submit">Save water test</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default AquariumWaterQuality;
