import { useState, useRef, type ChangeEvent } from "react";
import AquariumCard from "../components/AquariumCard";
import { aquariums } from "../data/aquariumData";
import type { AquariumType, Aquarium } from "../types/aquarium";
import { ALL, AQUARIUM_TYPES } from "../types/aquarium";
import AddAquariumModal from "../components/AddAquariumModal";

const generateRandomId = (): number => {
  return Math.floor(Math.random() * 1_000_000);
};

function AquariumListPage() {
  const [selectedType, setSelectedType] = useState<AquariumType>(ALL);
  const [filteredAquariums, setFilteredAquarium] =
    useState<Aquarium[]>(aquariums);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  function openForm() {
    setIsAddFormOpen(true);
  }

  function closeForm() {
    setIsAddFormOpen(false);
  }

  function onFilterAquarium() {
    const filteredAquariums = aquariums.filter((aquarium) => {
      if (!searchRef.current) return true;
      const matchesSearch = aquarium.name
        .toLowerCase()
        .includes(searchRef.current!.value.trim().toLowerCase());

      const matchesType =
        selectedType === ALL || aquarium.type === selectedType;
      return matchesSearch && matchesType;
    });
    setFilteredAquarium(filteredAquariums);
  }

  function onAddAquarium(
    name: string,
    selectedTypeInAdd: AquariumType,
    volumeValue: string,
    pHValue: string,
    gHValue: string,
    tdsValue: string,
  ): boolean {
    if (
      !name ||
      !selectedTypeInAdd ||
      !volumeValue ||
      !pHValue ||
      !gHValue ||
      !tdsValue
    ) {
      return false;
    }

    const volumn = Number(volumeValue);
    const pH = Number(pHValue);
    const gH = Number(gHValue);
    const tds = Number(tdsValue);

    const newAqua: Aquarium = {
      id: generateRandomId(),
      name: name,
      type: selectedTypeInAdd,
      volumeLitres: volumn,
      ph: pH,
      gh: gH,
      tds: tds,
    };
    setFilteredAquarium((prevAquas) => [...prevAquas, newAqua]);
    return true;
  }

  return (
    <main className="page">
      <section className="hero">
        <div>
          <span className="hero__eyebrow">AquaHub Dashboard</span>
          <h1>My Aquariums</h1>
          <p>
            Track your aquariums and keep an eye on important water parameters.
          </p>
        </div>

        <button className="primary-button" type="button" onClick={openForm}>
          + Add aquarium
        </button>
      </section>

      {isAddFormOpen && (
        <AddAquariumModal closeForm={closeForm} onAddAquarium={onAddAquarium} />
      )}

      <section className="filter-panel">
        <label className="field">
          <span>Search</span>

          <input
            type="search"
            ref={searchRef}
            placeholder="Search aquarium..."
            onChange={() => onFilterAquarium()}
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
            {AQUARIUM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
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
