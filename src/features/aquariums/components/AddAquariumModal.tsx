import { useRef, useState } from "react";
import Input from "../components/Input"
import {
  ALL,
  PLANTED,
  CARIDINA,
  NEOCARIDINA,
  COMMUNITY_FISH,
  type AquariumType,
} from "../types/aquarium";

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
  const TDSRef = useRef<HTMLInputElement>(null);
  const volumeRef = useRef<HTMLInputElement>(null);
  const pHRef = useRef<HTMLInputElement>(null);
  const gHRef = useRef<HTMLInputElement>(null);

  const [isNameEmpty, setIsNameEmpty] = useState(false);
  const [isTDSEmpty, setIsTDSEmpty] = useState(false);
  const [isVolumnEmpty, setIsVolumnEmpty] = useState(false);
  const [isPHEmpty, setIsPHEmpty] = useState(false);
  const [isGhEmpty, setIsGhEmpty] = useState(false);

  const [selectedTypeInAdd, setSelectedTypeInAdd] = useState<AquariumType | undefined>(ALL);
  const isSelectTypeEmpty = !(selectedTypeInAdd ? true : false);

  function onSaveAddAquarium(): void {
    const name = nameRef.current?.value.trim() ?? "";
    if(name==="") setIsNameEmpty(true);
    if(selectedTypeInAdd === ALL) setSelectedTypeInAdd(undefined); 
    const volumeValue = volumeRef.current?.value.trim() ?? "";
    if(volumeValue==="") setIsVolumnEmpty(true);
    const pHValue = pHRef.current?.value.trim() ?? "";
    if(pHValue==="") setIsPHEmpty(true);
    const gHValue = gHRef.current?.value.trim() ?? "";
    if(gHValue==="") setIsGhEmpty(true);
    const tdsValue = TDSRef.current?.value.trim() ?? "";
    if(tdsValue==="") setIsTDSEmpty(true);
    if(!name || selectedTypeInAdd === ALL || !volumeValue || !pHValue || !gHValue || !tdsValue) return;
    if (
      onAddAquarium(
        name,
        selectedTypeInAdd!,
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
            <Input
              ref={nameRef}
              isEmpty={isNameEmpty}
              onChange={(event) =>{
                if(event.target.value) setIsNameEmpty(false);
                else setIsNameEmpty(true);
              }}
              name="name"
              type="text"
              placeholder="e.g. Living Room Planted Tank"
            />
          </label>

          <label className="field">
            <span>Aquarium type</span>
            <select
              style={isSelectTypeEmpty ? {border: "1px solid red"} : undefined}
              name="type"
              defaultValue=""
              onChange={(event) => {
                setSelectedTypeInAdd(event.target.value as AquariumType);
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
            <Input
              ref={volumeRef}
              isEmpty={isVolumnEmpty}
              onChange={(event) =>{
                if(event.target.value) setIsVolumnEmpty(false);
                else setIsVolumnEmpty(true);
              }}
              name="volumeLitres"
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 38"
            />
          </label>

          <label className="field">
            <span>pH</span>
            <Input
              ref={pHRef}
              isEmpty={isPHEmpty}
              onChange={(event) =>{
                if(event.target.value) setIsPHEmpty(false);
                else setIsPHEmpty(true);
              }}
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
            <Input
              ref={gHRef}
              isEmpty={isGhEmpty}
              onChange={(event) =>{
                if(event.target.value) setIsGhEmpty(false);
                else setIsGhEmpty(true);
              }}
              name="gh"
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 6"
            />
          </label>

          <label className="field aquarium-form__full-width">
            <span>TDS (ppm)</span>
            <Input
              ref={TDSRef}
              isEmpty={isTDSEmpty}
              onChange={(event) =>{
                if(event.target.value) setIsTDSEmpty(false);
                else setIsTDSEmpty(true);
              }}
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
