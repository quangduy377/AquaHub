import { useRef } from "react";
import {
  ALL,
  PLANTED,
  CARIDINA,
  NEOCARIDINA,
  COMMUNITY_FISH,
  type AquariumType,
} from "../types/aquarium";

let selectedTypeInAdd: AquariumType;
const aquariumTypes: AquariumType[] = [
  ALL,
  PLANTED,
  CARIDINA,
  NEOCARIDINA,
  COMMUNITY_FISH,
];
export default function AddAquariumModal({
  closeForm,
  onAddAquarium,
}: {
  closeForm: () => void;
  onAddAquarium: (
    name: string,
    selectedTypeInAdd: AquariumType,
    volumeValue: string,
    pHValue: string,
    gHValue: string,
    tdsValue: string,
  ) => boolean;
}) {
  const nameRef = useRef<HTMLInputElement>(null);
  const volumeRef = useRef<HTMLInputElement>(null);
  const pHRef = useRef<HTMLInputElement>(null);
  const gHRef = useRef<HTMLInputElement>(null);
  const TDSRef = useRef<HTMLInputElement>(null);

  function onSaveAddAquarium(): void {
    const name = nameRef.current?.value.trim() ?? "";
    const volumeValue = volumeRef.current?.value.trim() ?? "";
    const pHValue = pHRef.current?.value.trim() ?? "";
    const gHValue = gHRef.current?.value.trim() ?? "";
    const tdsValue = TDSRef.current?.value.trim() ?? "";

    if (
      onAddAquarium(
        name,
        selectedTypeInAdd,
        volumeValue,
        pHValue,
        gHValue,
        tdsValue,
      )
    )
      closeForm();
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeForm();
        }
      }}
    >
      <section
        className="aquarium-form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-aquarium-title"
      >
        <div className="aquarium-form-modal__header">
          <div>
            <span className="form-eyebrow">New aquarium</span>
            <h2 id="add-aquarium-title">Add an aquarium</h2>
            <p>Enter the tank details and current water parameters.</p>
          </div>

          <button
            className="modal-close-button"
            type="button"
            aria-label="Close add aquarium form"
            onClick={closeForm}
          >
            &times;
          </button>
        </div>

        <form
          className="aquarium-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSaveAddAquarium();
          }}
        >
          <label className="field aquarium-form__full-width">
            <span>Aquarium name</span>
            <input
              ref={nameRef}
              name="name"
              type="text"
              placeholder="e.g. Living Room Planted Tank"
            />
          </label>

          <label className="field">
            <span>Aquarium type</span>
            <select
              name="type"
              defaultValue=""
              onChange={(event) => {
                selectedTypeInAdd = event.target.value as AquariumType;
              }}
            >
              <option value="" disabled>
                Select a type
              </option>
              {aquariumTypes
                .filter((type) => type !== ALL)
                .map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
            </select>
          </label>

          <label className="field">
            <span>Volume (litres)</span>
            <input
              ref={volumeRef}
              name="volumeLitres"
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 38"
            />
          </label>

          <label className="field">
            <span>pH</span>
            <input
              ref={pHRef}
              name="ph"
              type="number"
              min="0"
              max="14"
              step="0.1"
              placeholder="e.g. 6.8"
            />
          </label>

          <label className="field">
            <span>GH</span>
            <input
              ref={gHRef}
              name="gh"
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 6"
            />
          </label>

          <label className="field aquarium-form__full-width">
            <span>TDS (ppm)</span>
            <input
              ref={TDSRef}
              name="tds"
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 180"
            />
          </label>

          <div className="aquarium-form__actions">
            <button
              className="secondary-button"
              type="button"
              onClick={closeForm}
            >
              Cancel
            </button>
            <button className="primary-button" type="submit">
              Save aquarium
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
