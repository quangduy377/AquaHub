import { useState } from "react";
import styles from "./ShrimpsPage.module.css";
import { Link } from "react-router-dom";
import { PARAM_ROUTES } from "../../../routes/AquaRoutes";
import { shrimps } from "../data/shrimps";
import type { Category } from "../../aquariums/types/shrimp";
import { ShrimpTypes } from "../../aquariums/types/shrimp";


export default function TestingShrimpsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const query = search.trim().toLowerCase();
  const filteredShrimps = shrimps.filter((shrimp) =>
    shrimp.name.toLowerCase().includes(query) &&
    (category === "" || shrimp.category === category)
  );

  const categories = [ShrimpTypes.Cardiana, ShrimpTypes.Neocardiana];

  function clearFilters() {
    setSearch("");
    setCategory("");
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Shrimps</h1>
      <section className={styles.filters} aria-label="Search and filter shrimps">
        <label className={styles.field}>
          <span>Search</span>
          <input
            type="search"
            placeholder="Search shrimp name..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span>Category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value as Category | "")}>
            <option value="">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </section>
      <p className={styles.resultCount} role="status">
        {filteredShrimps.length} {filteredShrimps.length === 1 ? "shrimp" : "shrimps"} found
      </p>
      {filteredShrimps.length === 0 ? (
        <section className={styles.emptyState}>
          <h2>No shrimps found</h2>
          <p>Try another name or category.</p>
          <button type="button" className={styles.clearButton} onClick={clearFilters}>Clear filters</button>
        </section>
      ) : (
        <section className={styles.grid} aria-label="Shrimp collection">
          {filteredShrimps.map((shrimp) => (
            <article className={styles.card} key={shrimp.id}>
              <div className={styles.imageFrame}>
                <Link className={styles.imageLink} to={PARAM_ROUTES.SHRIMP_DETAIL(shrimp.id)} aria-label={`View ${shrimp.name}`}>
                  <img
                    className={styles.image}
                    src={shrimp.imageURL}
                    alt={`${shrimp.name} - ${shrimp.category} shrimp`}
                    loading="lazy"
                    width={600}
                    height={400}
                  />
                </Link>
              </div>
              <div className={styles.content}>
                <p className={styles.note}>
                  Photos are of G1 for actual Video of Purchase Please Whatsapp Us!
                </p>
                <p className={styles.category}>{shrimp.category}</p>
                <h2 className={styles.name}>{shrimp.name}</h2>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

