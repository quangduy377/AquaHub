import { useState, useRef } from "react";
import AquariumCard from "../components/AquariumCard";
import { aquariums } from "../data/aquariumData";
import { type AquariumType, type Aquarium, Action } from "../types/aquarium";
import { ALL, AQUARIUM_TYPES } from "../types/aquarium";
import AquariumModal from "../components/AquariumModal";
import styles from "./AquariumListPage.module.css";

const generateRandomId = (): number => {
  return Math.floor(Math.random() * 1_000_000);
};

function AquariumListPage() {
  const [selectedType, setSelectedType] = useState<AquariumType>(ALL);
  const [filteredAquariums, setFilteredAquarium] =
    useState<Aquarium[]>(aquariums);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [selectedAquarium, setSelectedAquarium] = useState<Aquarium | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  function openAquariumDetail(aquarium: Aquarium) {
    setSelectedAquarium(aquarium);
  }

  function closeAquariumDetail() {
    setSelectedAquarium(null);
  }

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

  function onUpdateAquarium(
    name: string,
    selectedTypeInAdd: AquariumType,
    volumeValue: number,
    pHValue: number,
    gHValue: number,
    tdsValue: number,): boolean{
      if(!name || !selectedTypeInAdd || !volumeValue ||
      !pHValue || !gHValue || !tdsValue) return false;

      const newAqua: Aquarium = {
        id: selectedAquarium!.id,
        name : name,
        type: selectedTypeInAdd,
        volumeLitres: volumeValue,
        ph: pHValue,
        gh: gHValue,
        tds: tdsValue
      }
      setSelectedAquarium(newAqua);
      setFilteredAquarium(prev=>{
        const newAquas = [...prev];
        const selectedAquaIndex = newAquas.findIndex(aqua => aqua.id === selectedAquarium!.id);
        newAquas[selectedAquaIndex] = newAqua;
        return newAquas;
      });
      return true;
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
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>AquaHub Dashboard</span>
          <h1>My Aquariums</h1>
          <p>
            Track your aquariums and keep an eye on important water parameters.
          </p>
        </div>

        <button className={styles.primaryButton} type="button" onClick={openForm}>
          + Add aquarium
        </button>
      </section>

      {isAddFormOpen && (
        <AquariumModal mode={Action.ADD} closeForm={closeForm} onAddAquarium={onAddAquarium}/>
      )}

      {selectedAquarium && (
        <AquariumModal
          mode={Action.VIEW}
          onUpdateAquarium={onUpdateAquarium}
          aquarium={selectedAquarium}
          closeForm={closeAquariumDetail}
        />
      )}

      <section className={styles.filterPanel}>
        <label className={styles.field}>
          <span>Search</span>

          <input
            type="search"
            ref={searchRef}
            placeholder="Search aquarium..."
            onChange={() => onFilterAquarium()}
          />
        </label>

        <label className={styles.field}>
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

      <section className={styles.resultsHeader}>
        <h2>Your tanks</h2>
        <span>
          {filteredAquariums.length}{" "}
          {filteredAquariums.length === 1 ? "aquarium" : "aquariums"}
        </span>
      </section>

      {filteredAquariums.length > 0 ? (
        <section className={styles.grid}>
          {filteredAquariums.map((aquarium) => (
            <AquariumCard key={aquarium.id} aquarium={aquarium} onViewDetails={openAquariumDetail}/>
          ))}
        </section>
      ) : (
        <section className={styles.emptyState}>
          <div className={styles.emptyIcon}>⌕</div>
          <h2>No aquariums found</h2>
          <p>Try changing the aquarium name or selected type.</p>

          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => {
              setSelectedType(ALL);
              setFilteredAquarium(aquariums);
              if(searchRef.current) searchRef.current.value = "";
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
