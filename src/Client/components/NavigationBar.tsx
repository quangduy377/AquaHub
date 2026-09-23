import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCurrentUser, logOut } from "../features/auth/services/authService";
import { getExistingAquas } from "../features/auth/services/aquaService";
import { PARAM_ROUTES, ROUTES } from "../routes/AquaRoutes";
import styles from "./NavigationBar.module.css";

export default function NavigationBar() {
  const navigate = useNavigate();
  const { email: routeEmail, aquariumId } = useParams();
  const [sessionEmail, setSessionEmail] = useState<string>();
  const [firstAquariumId, setFirstAquariumId] = useState<string>();
  const email = routeEmail ?? sessionEmail;
  const userName = email?.split("@")[0] ?? "Account";
  const aquariumListPath = email ? PARAM_ROUTES.AQUARIUMS(email) : ROUTES.HOME;
  const isWaterQuality = Boolean(aquariumId);
  const waterQualityId = aquariumId ?? firstAquariumId;
  const waterQualityPath = email && waterQualityId
    ? PARAM_ROUTES.AQUARIUM_WATER_QUALITY.URL(encodeURIComponent(email), waterQualityId)
    : undefined;
  const [isUserDropDownOpen, setUserDropDownOpen] = useState(false);
  const [isAquariumMenuOpen, setIsAquariumMenuOpen] = useState(false);
  const [isWaterQualityMenuOpen, setIsWaterQualityMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function closeMenus(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setIsAquariumMenuOpen(false);
        setIsWaterQualityMenuOpen(false);
        setUserDropDownOpen(false);
      }
    }
    document.addEventListener("pointerdown", closeMenus);
    return () => document.removeEventListener("pointerdown", closeMenus);
  }, []);


  useEffect(() => {
    let cancelled = false;
    async function loadNavigation() {
      const currentEmail = routeEmail ?? (await getCurrentUser())?.email;
      if (cancelled || !currentEmail) return;
      setSessionEmail(currentEmail);
      if (aquariumId) return;
      try {
        const aquariums = await getExistingAquas();
        if (!cancelled) setFirstAquariumId(aquariums[0]?.id);
      } catch {
        // Keep water quality unavailable when no aquarium can be loaded.
      }
    }
    void loadNavigation();
    return () => { cancelled = true; };
  }, [routeEmail, aquariumId]);

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


  return (
    <header className={styles.topbar} ref={headerRef} onKeyDown={(event) => {
      if (event.key === "Escape") {
        const menuId = isAquariumMenuOpen ? "aquarium-nav-toggle"
          : isWaterQualityMenuOpen ? "water-quality-nav-toggle" : "user-nav-toggle";
        setIsAquariumMenuOpen(false);
        setIsWaterQualityMenuOpen(false);
        setUserDropDownOpen(false);
        headerRef.current?.querySelector<HTMLButtonElement>(`#${menuId}`)?.focus();
      }
    }}>
      <Link className={styles.brand} to={aquariumListPath} aria-label="AquaHub home">
        <span className={styles.brandMark}>A</span>
        <span>AquaHub</span>
      </Link>
      <nav className={styles.mainNav} aria-label="Main navigation">
        <div className={styles.navMenu}>
          <button id="aquarium-nav-toggle" className={`${styles.navLink} ${!isWaterQuality ? styles.navLinkActive : ""}`} type="button"
            aria-expanded={isAquariumMenuOpen} aria-controls="aquarium-nav-dropdown"
            onClick={() => { setIsAquariumMenuOpen(current => !current); setUserDropDownOpen(false); setIsWaterQualityMenuOpen(false); }}>
            Aquariums <span className={styles.navChevron} aria-hidden="true">⌄</span>
          </button>
          {isAquariumMenuOpen && (
            <div id="aquarium-nav-dropdown" className={styles.navDropdown}>
              <Link to={aquariumListPath} onClick={() => setIsAquariumMenuOpen(false)}>All aquariums</Link>
              <button type="button" onClick={() => { setIsAquariumMenuOpen(false); navigate(`${aquariumListPath}?addAquarium=true`); }}>
                <span className={styles.menuPlus} aria-hidden="true">+</span> Add aquarium
              </button>
            </div>
          )}
        </div>
        <div className={styles.navMenu}>
          <button id="water-quality-nav-toggle" type="button"
            className={`${styles.navLink} ${isWaterQuality ? styles.navLinkActive : ""}`}
            aria-current={isWaterQuality ? "page" : undefined}
            aria-expanded={isWaterQualityMenuOpen} aria-controls="water-quality-nav-dropdown"
            disabled={!waterQualityPath}
            title={!waterQualityPath ? "Add an aquarium to view water quality" : undefined}
            onClick={() => {
              setIsWaterQualityMenuOpen(current => !current);
              setIsAquariumMenuOpen(false);
              setUserDropDownOpen(false);
            }}>
            Water quality <span className={styles.navChevron} aria-hidden="true">⌄</span>
          </button>
          {isWaterQualityMenuOpen && waterQualityPath && (
            <div id="water-quality-nav-dropdown" className={styles.navDropdown}>
              <Link to={waterQualityPath} onClick={() => setIsWaterQualityMenuOpen(false)}>Overview</Link>
              <button type="button" onClick={() => {
                setIsWaterQualityMenuOpen(false);
                navigate(`${waterQualityPath}?addWaterTest=true`);
              }}>
                <span className={styles.menuPlus} aria-hidden="true">+</span> Add water test
              </button>
            </div>
          )}
        </div>
      </nav>
      <div className={styles.topbarActions}>
        <div className={styles.userMenu}>
          <button id="user-nav-toggle" className={styles.userButton} type="button"
            aria-label={`${userName} account`} aria-expanded={isUserDropDownOpen} aria-controls="user-nav-dropdown"
            onClick={() => { setUserDropDownOpen(current => !current); setIsAquariumMenuOpen(false); setIsWaterQualityMenuOpen(false); }}>
            <span className={styles.avatar}>{userName.charAt(0).toUpperCase()}</span>
            <span className={styles.userName}>{userName}</span>
            <span className={styles.chevron} aria-hidden="true">⌄</span>
          </button>
          {isUserDropDownOpen && (
            <div id="user-nav-dropdown" className={styles.dropdown}>
              <div className={styles.dropdownIntro}><strong>{userName}</strong><span>{email}</span></div>
              <button type="button" disabled>Profile</button>
              <button type="button" disabled>Account settings</button>
              <button type="button" onClick={() => void handleSignOut()}>Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
