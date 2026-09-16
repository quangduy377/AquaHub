import type { Aquarium } from "../types/aquarium";
import styles from "./AquariumCard.module.css";
import { useNavigate } from "react-router-dom";
import { PARAM_ROUTES } from "../../../routes/AquaRoutes";
interface AquariumCardProps {
  aquarium: Aquarium;
  onViewDetails: (aquarium: Aquarium) => void;
}

function AquariumCard({ aquarium, onViewDetails }: AquariumCardProps) {
  const navigate = useNavigate();
  const { AQUARIUM_WATER_QUALITY } = PARAM_ROUTES;
  return (
    <article className={styles.card} onClick={() => onViewDetails(aquarium)}>
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

      <button className={styles.button} type="button" onClick={() => {
        //TODO: How to get user-email ????, still hard coded
        navigate(AQUARIUM_WATER_QUALITY.URL("quangduy377@gmail.com", aquarium.id));
      }}>
        View Water Quality
      </button>
    </article>
  );
}

export default AquariumCard;
