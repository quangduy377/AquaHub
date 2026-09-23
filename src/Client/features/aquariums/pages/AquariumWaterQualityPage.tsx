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
import { getExistingAquas, getWaterReadingsByAquariumId, addWaterReading, deleteWaterReading } from "../../auth/services/aquaService";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { PARAM_ROUTES } from "../../../routes/AquaRoutes";



function AquariumWaterQuality() {
  const params = useParams();
  const navigate = useNavigate();
  const { AQUARIUM_WATER_QUALITY } = PARAM_ROUTES;
  const aquariumId = params[AQUARIUM_WATER_QUALITY.AquariumIdParamKey]!;
  const email = params[AQUARIUM_WATER_QUALITY.EmailParamKey]!;
  const selectedAquariumId = aquariumId;
  const [readings, setReadings] = useState<WaterReading[]>([]);
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("All");
  const [searchParams, setSearchParams] = useSearchParams();
  const isFormOpen = searchParams.get("addWaterTest") === "true";
  const [saveMessage, setSaveMessage] = useState("");
  const [aquarium, setAquarium] = useState<Aquarium | null>(null);
  const [aquariums, setAquariums] = useState<Aquarium[]>([]);

  function openForm() {
    setSearchParams(current => {
      current.set("addWaterTest", "true");
      return current;
    });
  }

  function closeForm() {
    setSearchParams(current => {
      current.delete("addWaterTest");
      return current;
    }, { replace: true });
  }
  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const aquariums = await getExistingAquas();
        if (cancelled) return;
        setAquariums(aquariums);
        const aquarium = aquariums.find((item) => item.id === selectedAquariumId) ?? aquariums[0];
        setAquarium(aquarium);
        try {
          const readings = await getWaterReadingsByAquariumId(email, selectedAquariumId);
          if (!cancelled) setReadings(readings);
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
    return () => { cancelled = true; };
  }, [email, selectedAquariumId]);

  const latest = readings[0];
  const latestStatus = latest ? getReadingStatus(parameterMeta, latest) : "Attention";
  const filteredHistory = readings.filter(
    (reading) => historyFilter === "All" || getReadingStatus(parameterMeta, reading) === historyFilter,
  );

  async function submitReading(newReading: WaterReading, targetAquariumId: string): Promise<void> {
    try {
      const addedreading = await addWaterReading(email, targetAquariumId, newReading);
      if (addedreading != null) {
        if (targetAquariumId === selectedAquariumId) {
          setReadings(prev => [addedreading, ...prev]);
        } else {
          setAquarium(aquariums.find(item => item.id === targetAquariumId) ?? null);
          setReadings([addedreading]);
        }
        setHistoryFilter("All");
        const tankName = aquariums.find(item => item.id === targetAquariumId)?.name;
        setSaveMessage(tankName ? `Water test saved for ${tankName}.` : "Water test saved successfully.");
        const nextSearchParams = new URLSearchParams(searchParams);
        nextSearchParams.delete("addWaterTest");
        navigate({
          pathname: AQUARIUM_WATER_QUALITY.URL(encodeURIComponent(email), targetAquariumId),
          search: nextSearchParams.toString(),
        }, { replace: true });
      }
      else {
        //TODO: Should keep the form open, and use dialert to show error message
      }
    }
    catch {
      //TODO: Make use of the error
    }
  }

  async function deleteReading(readingId: number): Promise<void> {
    try {
      await deleteWaterReading(email, selectedAquariumId, readingId)
      setReadings(prevReadings => prevReadings.filter(rd => rd.id !== readingId));
    }
    catch {
      //TODO: Show dialog saying failed to delete reading. Reading might be deleted before or not exist.
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
                const nextAquariumId = event.target.value;
                setAquarium(aquariums.find(item => item.id === nextAquariumId) ?? null);
                setReadings([]);
                navigate(AQUARIUM_WATER_QUALITY.URL(encodeURIComponent(email), nextAquariumId));
                setHistoryFilter("All");
                setSaveMessage("");
              }}
            >
              {aquariums.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <button className={styles.primaryButton} type="button" disabled={!aquarium} onClick={openForm}>
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
            <TestHistoryTable history={filteredHistory} deleteReading={deleteReading} />
            : <div className={styles.emptyState}>No tests match this filter.</div>}
        </div>
      </section>

      {isFormOpen && aquarium &&
        <WaterQualityInputModal aquarium={aquarium}
          aquariums={aquariums}
          submitReading={submitReading}
          closeForm={closeForm} />
      }
    </main>
  );
}

export default AquariumWaterQuality;
