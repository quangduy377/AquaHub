import type { Aquarium } from "../types/aquarium";

interface AquariumCardProps {
  aquarium: Aquarium;
}

function AquariumCard({ aquarium }: AquariumCardProps) {
  return (
    <article className="aquarium-card">
      <div className="aquarium-card__header">
        <div>
          <span className="aquarium-card__label">Aquarium</span>
          <h2>{aquarium.name}</h2>
        </div>

        <span className="aquarium-card__type">{aquarium.type}</span>
      </div>

      <p className="aquarium-card__volume">
        Volume: <strong>{aquarium.volumeLitres} litres</strong>
      </p>

      <div className="aquarium-card__parameters">
        <div className="parameter">
          <span>pH</span>
          <strong>{aquarium.ph}</strong>
        </div>

        <div className="parameter">
          <span>GH</span>
          <strong>{aquarium.gh}</strong>
        </div>

        <div className="parameter">
          <span>TDS</span>
          <strong>{aquarium.tds}</strong>
          <small>ppm</small>
        </div>
      </div>

      <button className="aquarium-card__button" type="button">
        View details
      </button>
    </article>
  );
}

export default AquariumCard;