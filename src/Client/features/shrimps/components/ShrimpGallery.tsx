import styles from "./ShrimpGallery.module.css";
import { useState } from "react";
export function ShrimpGallery({ images, name }: { images: string[]; name: string }) {
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
