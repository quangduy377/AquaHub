import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../../../routes/AquaRoutes";
import { shrimps } from "../data/shrimps";
import { shrimpDetails } from "../data/shrimpDetails";
import styles from "./ShrimpDetailPage.module.css";

function Gallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(0);
  return (
    <section aria-label={`${name} photos`}>
      <img className={styles.mainImage} src={images[selected]} alt={`${name} — ${selected === 0 ? "main photo" : "similar shrimp reference photo"}`} />
      <div className={styles.thumbnails}>
        {images.map((src, index) => (
          <button type="button" key={src} className={styles.thumbnail} aria-pressed={selected === index}
            aria-label={`Show ${index === 0 ? "main photo" : `reference photo ${index}`}`}
            onClick={() => setSelected(index)}>
            <img src={src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </section>
  );
}

export default function ShrimpDetailPage() {
  const { shrimpId } = useParams();
  const shrimp = shrimps.find((item) => item.id === shrimpId);
  const details = shrimp ? shrimpDetails[shrimp.id] : undefined;

  return (
    <main className={styles.page}>
      <Link className={styles.backLink} to={ROUTES.TESTING_SHRIMPS}>← Back to shrimps</Link>
      {!shrimp || !details ? (
        <section className={styles.info}><h1>Shrimp not found</h1><p>Return to the collection to choose a shrimp.</p></section>
      ) : (
        <div className={styles.layout}>
          <Gallery key={shrimp.id} name={shrimp.name} images={[shrimp.imageURL, ...details.relatedImages]} />
          <section className={styles.info}>
            <p className={styles.category}>Shrimp type · {shrimp.category}</p>
            <h1>{shrimp.name}</h1>
            {shrimp.description && <p>{shrimp.description}</p>}
            <h2>Recommended water parameters</h2>
            <dl className={styles.parameters}>
              {details.parameters.map(({ label, value }) => (
                <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
              ))}
            </dl>
            <p className={styles.note}>{details.note}</p>
            <a className={styles.backLink} href={details.source} target="_blank" rel="noreferrer">Care reference ↗</a>
          </section>
        </div>
      )}
    </main>
  );
}
