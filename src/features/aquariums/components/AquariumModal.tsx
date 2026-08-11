import { useRef, useState } from "react";
import Input from "./Input"
import styles from "./AquariumModal.module.css";
import {type AquariumModalProps, Action} from "../types/aquarium";
import {
  ALL,
  PLANTED,
  CARIDINA,
  NEOCARIDINA,
  COMMUNITY_FISH,
  type AquariumType,
  type Aquarium,
} from "../types/aquarium";


const aquariumTypes: AquariumType[] = [
  ALL,
  PLANTED,
  CARIDINA,
  NEOCARIDINA,
  COMMUNITY_FISH,
];

export default function AquariumModal(props: AquariumModalProps) {
  let aquarium: Aquarium | null = null;
  let isAddAqua:boolean = false;
  if(props.mode === Action.EDIT) aquarium = props.aquarium;
  if(props.mode === Action.ADD) isAddAqua = true;
  
  const isReadOnly = aquarium ? true : false;
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
  const [isEdit, setIsEdit] = useState(false);

  const defaultType = aquarium ? aquarium.type : ALL;
  const [selectedTypeInAdd, setSelectedTypeInAdd] = useState<AquariumType | undefined>(defaultType);
  const isSelectTypeEmpty = !(selectedTypeInAdd ? true : false);

  function enterEditMode(): void{
    setIsEdit(true);
  }

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
    console.log(selectedTypeInAdd); //TODO: Bug
    if(!name || selectedTypeInAdd === ALL || !volumeValue || !pHValue || !gHValue || !tdsValue) return;

    if(isAddAqua && props.mode === Action.ADD && props.onAddAquarium(
        name,
        selectedTypeInAdd!,
        volumeValue,
        pHValue,
        gHValue,
        tdsValue,
      )){
      props.closeForm();
    }


    else if(isEdit && props.mode === Action.EDIT && props.onUpdateAquarium(name,
        selectedTypeInAdd!,
        Number(volumeValue),
        Number(pHValue),
        Number(gHValue),
        Number(tdsValue))){
      props.closeForm();
    }
  }

  let buttonName;
  if(isEdit || isAddAqua) buttonName = "Save"; //TODO: May add the "Add" condition
  else buttonName = "Edit"; 

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          props.closeForm();
        }
      }}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-aquarium-title"
      >
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>
              {aquarium ? "" : "New aquarium"}
            </span>
            <h2 id="add-aquarium-title">
              {aquarium ? aquarium.name : "Add an aquarium"}
            </h2>
            <p>{aquarium ? "" : "Enter the tank details and current water parameters."}</p>
          </div>

          <button
            className={styles.closeButton}
            type="button"
            aria-label="Close add aquarium form"
            onClick={props.closeForm}
          >
            &times;
          </button>
        </div>

        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            if(isAddAqua || isEdit){
              onSaveAddAquarium();
            }
            else{
              enterEditMode();
            }
          }}
        >
          <label className={`${styles.field} ${styles.fullWidth}`}>
            <span>Aquarium name</span>
            <Input
              ref={nameRef}
              readOnly={isReadOnly && !isEdit}
              defaultValue={aquarium?.name ?? ""}
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

          <label className={styles.field}>
            <span>Aquarium type</span>
            <select
              className={isSelectTypeEmpty ? styles.invalid : undefined}
              disabled={isReadOnly && !isEdit}
              name="type"
              defaultValue={aquarium ? aquarium.type : ""}
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

          <label className={styles.field}>
            <span>Volume (litres)</span>
            <Input
              ref={volumeRef}
              defaultValue={aquarium?.volumeLitres ?? ""}
              readOnly={isReadOnly && !isEdit}
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

          <label className={styles.field}>
            <span>pH</span>
            <Input
              ref={pHRef}
              isEmpty={isPHEmpty}
              defaultValue={aquarium?.ph ?? ""}
              readOnly={isReadOnly && !isEdit}
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

          <label className={styles.field}>
            <span>GH</span>
            <Input
              ref={gHRef}
              isEmpty={isGhEmpty}
              defaultValue={aquarium?.gh ?? ""}
              readOnly={isReadOnly && !isEdit}
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

          <label className={`${styles.field} ${styles.fullWidth}`}>
            <span>TDS (ppm)</span>
            <Input
              ref={TDSRef}
              defaultValue={aquarium?.tds ?? ""}
              readOnly={isReadOnly && !isEdit}
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

          <div className={styles.actions}>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={props.closeForm}
            >
              Cancel
            </button>
            <button className={styles.primaryButton} type="submit">
              {buttonName}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
