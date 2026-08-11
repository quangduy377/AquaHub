import type { Aquarium } from "../types/aquarium";
import styles from "./AquariumCard.module.css";

interface AquariumCardProps {
  aquarium: Aquarium;
  onViewDetails: (aquarium: Aquarium) => void;
}

function AquariumCard({ aquarium, onViewDetails }: AquariumCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div>
          <span className={styles.label}>Aquarium</span>
          <h2>{aquarium.name}</h2>
        </div>

        <span className={styles.type}>{aquarium.type}</span>
      </div>

      <p className={styles.volume}>
        Volume: <strong>{aquarium.volumeLitres} litres</strong>
      </p>

      <div className={styles.parameters}>
        <div className={styles.parameter}>
          <span>pH</span>
          <strong>{aquarium.ph}</strong>
        </div>

        <div className={styles.parameter}>
          <span>GH</span>
          <strong>{aquarium.gh}</strong>
        </div>

        <div className={styles.parameter}>
          <span>TDS</span>
          <strong>{aquarium.tds}</strong>
          <small>ppm</small>
        </div>
      </div>

      <button className={styles.button} type="button" onClick={()=>{
        onViewDetails(aquarium);
      }}>
        View details
      </button>
    </article>
  );
}

export default AquariumCard;
