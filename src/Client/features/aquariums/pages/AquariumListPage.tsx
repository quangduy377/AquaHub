import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AquariumCard from "../components/AquariumCard";
// import { aquariums } from "../data/aquariumData";
import { type AquariumType, type Aquarium, Action, type AquariumPayload } from "../types/aquarium";
import { ALL, AQUARIUM_TYPES } from "../types/aquarium";
import AquariumModal from "../components/AquariumModal";
import styles from "./AquariumListPage.module.css";
import { logOut } from "../../auth/services/authService";
import { getExistingAquas, addAqua, updateAqua } from "../../auth/services/aquaService";
import { ROUTES } from "../../../routes/AquaRoutes";

let aquariums: Aquarium[] = [];

function AquariumListPage() {
  const navigate = useNavigate();
  const { email } = useParams<{ email: string }>();
  const userName = email!.replace("@gmail.com", "");
  const [selectedType, setSelectedType] = useState<AquariumType>(ALL);
  const [filteredAquariums, setFilteredAquarium] =
    useState<Aquarium[]>([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [selectedAquarium, setSelectedAquarium] = useState<Aquarium | null>(null);
  const [isUserDropDownOpen, setUserDropDownOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function getAquas() {
      try {
        aquariums = await getExistingAquas();
      }
      catch (err) {
        if (err instanceof Error) {
          //TODO: Add error here
          console.log(err.message);
        }
      }
      setFilteredAquarium(aquariums);
    }
    getAquas();
  }, [])

  async function handleSignOut(): Promise<void> {
    try {
      await logOut();
      navigate(ROUTES.LOGIN, { replace: true });
    }
    catch (err) {
      //TODO: should make use of this error
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  }

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
    const newFilteredAquas = aquariums.filter((aquarium) => {
      if (!searchRef.current) return true;
      const matchesSearch = aquarium.name
        .toLowerCase()
        .includes(searchRef.current!.value.trim().toLowerCase());

      const matchesType =
        selectedType === ALL || aquarium.type === selectedType;
      return matchesSearch && matchesType;
    });
    setFilteredAquarium(newFilteredAquas);
  }

  async function onUpdateAquarium(
    name: string,
    selectedTypeInAdd: AquariumType,
    volumeValue: number,
    pHValue: number,
    gHValue: number,
    tdsValue: number,): Promise<boolean> {
    if (!name || !selectedTypeInAdd || !volumeValue ||
      !pHValue || !gHValue || !tdsValue) return false;

    const payload: AquariumPayload = {
      aquariumId: selectedAquarium!.id,
      name: name,
      type: selectedTypeInAdd,
      volumeLitres: volumeValue,
      ph: pHValue,
      gh: gHValue,
      tds: tdsValue
    }
    try {
      const updatedAqua = await updateAqua(payload);
      if (!updatedAqua) return false;
      setSelectedAquarium(updatedAqua);
      setFilteredAquarium(prev => {
        const newAquas = [...prev];
        const selectedAquaIndex = newAquas.findIndex(aqua => aqua.id === selectedAquarium!.id);
        newAquas[selectedAquaIndex] = updatedAqua;
        return newAquas;
      });
      return true;
    }
    catch {
      //TODO: Do something with the error
      return false;
    }
  }



  async function onAddAquarium(
    name: string,
    selectedTypeInAdd: AquariumType,
    volumeValue: string,
    pHValue: string,
    gHValue: string,
    tdsValue: string,
  ): Promise<boolean> {
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
      id: "",
      name: name,
      type: selectedTypeInAdd,
      volumeLitres: volumn,
      ph: pH,
      gh: gH,
      tds: tds,
    };

    try {
      const success = await addAqua(newAqua) != null;
      if (success) setFilteredAquarium((prevAquas) => [...prevAquas, newAqua]);
      return success;
    }
    catch {
      //TODO: Do something with the error
      console.log("add aqua FAILED");
      return false;
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>AquaHub Dashboard</span>
          <h1>{`${userName} 's Aquariums`}</h1>
          <p>
            Track your aquariums and keep an eye on important water parameters.
          </p>
        </div>

        <div className={styles.heroActions}>
          <button className={styles.primaryButton} type="button" onClick={openForm}>
            + Add aquarium
          </button>
          <div className={styles.userMenu}>
            <button
              className={styles.userMenuButton}
              type="button"
              aria-expanded={isUserDropDownOpen}
              aria-haspopup="menu"
              onClick={() => setUserDropDownOpen((current) => !current)}>
              {userName} <span aria-hidden="true">▾</span>
            </button>

            {isUserDropDownOpen && (
              <div className={styles.dropdownMenu} role="menu">
                <button type="button" role="menuitem">Profile</button>
                <button type="button" role="menuitem">Settings</button>
                <button type="button" role="menuitem" onClick={() => void handleSignOut()}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {isAddFormOpen && (
        <AquariumModal mode={Action.ADD} closeForm={closeForm} onAddAquarium={onAddAquarium} />
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
            <AquariumCard key={aquarium.id} aquarium={aquarium} onViewDetails={openAquariumDetail} />
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
              if (searchRef.current) searchRef.current.value = "";
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
