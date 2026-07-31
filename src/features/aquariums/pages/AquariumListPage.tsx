import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import AquariumCard from "../components/AquariumCard";
import { aquariums } from "../data/aquariumData";
import type { AquariumType, Aquarium } from "../types/aquarium";
import {ALL, PLANTED, CARIDINA, NEOCARIDINA, COMMUNITY_FISH} from "../types/aquarium";

const aquariumTypes: AquariumType[] = [
  ALL, PLANTED, CARIDINA, NEOCARIDINA, COMMUNITY_FISH
];

const generateRandomId = (): number => {
  return Math.floor(Math.random() * 1_000_000);
};

let selectedTypeInAdd:AquariumType;

function AquariumListPage() {
  const [selectedType, setSelectedType] = useState<AquariumType>(ALL);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [filteredAquariums, setFilteredAquarium] = useState<Aquarium[]>(aquariums);

  const searchRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const volumeRef = useRef<HTMLInputElement>(null);
  const pHRef = useRef<HTMLInputElement>(null);
  const gHRef = useRef<HTMLInputElement>(null);
  const TDSRef = useRef<HTMLInputElement>(null);


  function closeForm(){
    setIsAddFormOpen(false);
  }

  function openForm(){
    setIsAddFormOpen(true);
  }

  function onFilterAquarium(event: ChangeEvent<HTMLInputElement>){
    const filteredAquariums = 
    aquariums.filter((aquarium) => {
      if(!searchRef.current) return true;
      const matchesSearch = aquarium.name.toLowerCase().includes(searchRef.current!.value.trim().toLowerCase());
      const matchesType = selectedType === ALL || aquarium.type === selectedType;
      return matchesSearch && matchesType;
    });
    setFilteredAquarium(filteredAquariums);
  };

  function onAddAquarium(event: FormEvent<HTMLFormElement>): boolean {
    event.preventDefault();
    const name = nameRef.current?.value.trim() ?? "";
    const volumeValue = volumeRef.current?.value.trim() ?? "";
    const pHValue = pHRef.current?.value.trim() ?? "";
    const gHValue = gHRef.current?.value.trim() ?? "";
    const tdsValue = TDSRef.current?.value.trim() ?? "";

    if (!name || !selectedTypeInAdd || !volumeValue || !pHValue || !gHValue || !tdsValue) {
      return false;
    }

    const volumn = Number(volumeValue);
    const pH = Number(pHValue);
    const gH = Number(gHValue);
    const tds = Number(tdsValue);

    const newAqua:Aquarium = {
      id: generateRandomId(),
      name: name,
      type: selectedTypeInAdd,
      volumeLitres: volumn,
      ph: pH,
      gh: gH,
      tds: tds
    }
    setFilteredAquarium(prevAquas => [...prevAquas,newAqua]);
    return true;
  }

  return (
    <main className="page">
      <section className="hero">
        <div>
          <span className="hero__eyebrow">AquaHub Dashboard</span>
          <h1>My Aquariums</h1>
          <p>
            Track your aquariums and keep an eye on important water
            parameters.
          </p>
        </div>

        <button
          className="primary-button"
          type="button"
          onClick={openForm}
        >
          + Add aquarium
        </button>
      </section>

      {isAddFormOpen && (
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
                onClick={closeForm}>
                &times;
              </button>
            </div>

            <form
              className="aquarium-form"
              onSubmit={(event)=>{
                if (onAddAquarium(event)) closeForm();
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
                <select name="type" defaultValue="" onChange={(event)=>{selectedTypeInAdd = event.target.value as AquariumType}}>
                  <option value="" disabled>
                    Select a type
                  </option>
                  {aquariumTypes
                    .filter((type) => type !== ALL)
                    .map((type) => (
                      <option key={type} value={type}>{type}</option>
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
      )}

      <section className="filter-panel">
        <label className="field">
          <span>Search</span>

          <input
            type="search"
            ref={searchRef}
            placeholder="Search aquarium..."
            onChange={onFilterAquarium}
          />
        </label>

        <label className="field">
          <span>Aquarium type</span>

          <select
            value={selectedType}
            onChange={(event) =>
              setSelectedType(event.target.value as AquariumType)
            }
          >
            {aquariumTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="results-header">
        <h2>Your tanks</h2>
        <span>
          {filteredAquariums.length}{" "}
          {filteredAquariums.length === 1 ? "aquarium" : "aquariums"}
        </span>
      </section>

      {filteredAquariums.length > 0 ? (
        <section className="aquarium-grid">
          {filteredAquariums.map((aquarium) => (
            <AquariumCard key={aquarium.id} aquarium={aquarium} />
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <div className="empty-state__icon">⌕</div>
          <h2>No aquariums found</h2>
          <p>Try changing the aquarium name or selected type.</p>

          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setSelectedType(ALL);
            }}
          >
            Clear filters
          </button>
        </section>
      )}
    </main>
  );
}

export default AquariumListPage;
