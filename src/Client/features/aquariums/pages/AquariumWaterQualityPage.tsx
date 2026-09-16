import { useEffect, useState } from "react";
import styles from "./AquariumWaterQualityPage.module.css";
import { formatDate } from "../../../utils/dateUtils";
import type { HistoryFilter, WaterReading, Aquarium } from "../types/aquarium";
import { parameterMeta, chartMeta } from "../types/aquarium";
import { getReadingStatus } from "../../../utils/statusUtils";
import WaterQualityInputModal from "../components/WaterQualityInputModal";
import Chart from "../components/Chart";
import ParameterCard from "../components/ParameterCard";
import TestHistoryTable from "../components/TestHistoryTable";
import { getExistingAquas, getWaterReadingsByAquariumId, addWaterReading } from "../../auth/services/aquaService";
import { useParams } from "react-router-dom";
import { PARAM_ROUTES } from "../../../routes/AquaRoutes";



function AquariumWaterQuality() {
  const params = useParams();
  const { AQUARIUM_WATER_QUALITY } = PARAM_ROUTES;
  const aquariumId = params[AQUARIUM_WATER_QUALITY.AquariumIdParamKey]!;
  const email = params[AQUARIUM_WATER_QUALITY.EmailParamKey]!;
  const [selectedAquariumId, setSelectedAquariumId] = useState<string>(aquariumId!);
  const [readings, setReadings] = useState<WaterReading[]>([]);
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [aquarium, setAquarium] = useState<Aquarium | null>(null);
  const [aquariums, setAquariums] = useState<Aquarium[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const aquariums = await getExistingAquas();
        setAquariums(aquariums);
        const aquarium = aquariums.find((item) => item.id === selectedAquariumId) ?? aquariums[0];
        setAquarium(aquarium);
        try {
          const readings = await getWaterReadingsByAquariumId(email, selectedAquariumId);
          setReadings(readings);
        }
        //Do nothing for now
        catch (err) {
          if (err instanceof Error) console.log(err.message);
        }

        //
      }
      catch {
        //TODO: Do something
      }
    }
    fetchData();
  }, [selectedAquariumId]);

  const latest = readings[0];
  const latestStatus = latest ? getReadingStatus(parameterMeta, latest) : "Attention";
  const filteredHistory = readings.filter(
    (reading) => historyFilter === "All" || getReadingStatus(parameterMeta, reading) === historyFilter,
  );

  async function submitReading(newReading: WaterReading): Promise<void> {
    try {
      const addedreading = await addWaterReading(email, selectedAquariumId, newReading);
      if (addedreading != null) {
        setReadings(prev => [...prev, addedreading]);
        setSaveMessage("Water test saved successfully.");
        setIsFormOpen(false);
      }
      else {
        //TODO: Should keep the form open, and use dialert to show error message
      }
    }
    catch {
      //TODO: Make use of the error
    }

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
                console.log("aqua id client: ", event.target.value);
                setSelectedAquariumId(event.target.value);
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
            <span className={styles.mutedLabel}>{aquarium?.type} aquarium</span>
            <h2>{aquarium?.name}</h2>
            <p>{aquarium?.volumeLitres} litres · {readings.length} recorded tests</p>
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
            {parameterMeta.map((el, index) => <ParameterCard key={index} reading={latest} parameterInfo={el} />)}
          </div>
        ) : <div className={styles.emptyState}>No readings yet. Add a water test to get started.</div>}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div><h2>Parameter trends</h2><p>Each chart shows up to eight of the most recent water tests.</p></div>
          <span className={styles.chartLegend}><i /> Oldest to newest</span>
        </div>
        <div className={styles.chartGrid}>

          {chartMeta.map(prop => <Chart readings={readings}
            key={prop.key}
            config={prop} />)}
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
          {filteredHistory.length > 0 ?
            <TestHistoryTable history={filteredHistory} />
            : <div className={styles.emptyState}>No tests match this filter.</div>}
        </div>
      </section>

      {isFormOpen &&
        <WaterQualityInputModal aquarium={aquarium!}
          submitReading={submitReading}
          closeForm={() => setIsFormOpen(false)} />
      }
    </main>
  );
}

export default AquariumWaterQuality;
