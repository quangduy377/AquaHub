import styles from "./WaterQualityInputModal.module.css"
import type { Aquarium, ReadingForm, WaterReading } from "../types/aquarium"
import { useState } from "react";
import { parameterMeta } from "../types/aquarium";

interface WaterQualityInputProps {
    aquarium: Aquarium;
    aquariums: Aquarium[];
    submitReading: (newReading: WaterReading, aquariumId: string) => Promise<void>;
    closeForm: () => void;
}

const emptyForm: ReadingForm = {
    ph: 7,
    temperature: 25,
    ammonia: 0,
    nitrite: 0,
    nitrate: 10,
    gh: 6,
    kh: 3,
    tds: 160,
    note: "",
};

export default function WaterQualityInputModal({ aquarium, aquariums, submitReading, closeForm }: WaterQualityInputProps) {
    const [form, setForm] = useState<ReadingForm>(emptyForm);
    const [selectedAquariumId, setSelectedAquariumId] = useState(aquarium.id);
    const [isSaving, setIsSaving] = useState(false);
    const selectedAquarium = aquariums.find(item => item.id === selectedAquariumId);

    function updateData(key: keyof ReadingForm, value: string) {
        let finalVal: string | number;
        if (key === "note") finalVal = value;
        else finalVal = Number(value);
        setForm((current) => ({ ...current, [key]: finalVal }));
    }

    async function saveReading() {
        if (!selectedAquarium || isSaving) return;
        const newReading: WaterReading = {
            id: Date.now(),
            recordedAt: new Date().toISOString(),
            ph: form["ph"],
            gh: form["gh"],
            kh: form["kh"],
            tds: form["tds"],
            temperature: form["temperature"],
            ammonia: form["ammonia"],
            nitrite: form["nitrite"],
            nitrate: form["nitrate"],
            note: form["note"],
        };
        setIsSaving(true);
        try {
            await submitReading(newReading, selectedAquarium.id);
        } finally {
            setIsSaving(false);
        }
    }



    return (
        <div className={styles.backdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeForm()}>
            <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="water-test-title">
                <div className={styles.modalHeader}>
                    <div><span className={styles.eyebrow}>New measurement</span><h2 id="water-test-title">Add water test</h2><p>Record the latest parameters for {selectedAquarium?.name ?? "your tank"}.</p></div>
                    <button type="button" className={styles.closeButton} aria-label="Close" onClick={closeForm}>×</button>
                </div>
                <form onSubmit={async (evt) => {
                    evt.preventDefault();
                    await saveReading();
                }}>
                    <div className={styles.formGrid}>
                        <label className={`${styles.field} ${styles.fullWidth} ${styles.tankField}`}>
                            <span>Tank</span>
                            <select required value={selectedAquariumId} disabled={isSaving}
                                onChange={event => setSelectedAquariumId(event.target.value)}>
                                {aquariums.map(item => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </label>
                        {parameterMeta.map(({ key, label, unit }) => (
                            <label className={styles.field} key={key}>
                                <span>{label} {unit && <small>({unit})</small>}</span>
                                <input type="number" min="0" step="0.1"
                                    required value={form[key]}
                                    onChange={(event) => updateData(key, event.target.value)}
                                />
                            </label>
                        ))}
                        <label className={`${styles.field} ${styles.fullWidth}`}>
                            <span>Note <small>(optional)</small></span>
                            <textarea rows={3} placeholder="e.g. After a 20% water change"
                                onChange={event => updateData("note", event.target.value)} />
                        </label>
                    </div>
                    <div className={styles.formActions}>
                        <button className={styles.cancelButton} type="button" onClick={closeForm}>Cancel</button>
                        <button className={styles.primaryButton} type="submit" disabled={isSaving || !selectedAquarium}>
                            {isSaving ? "Saving..." : "Save water test"}
                        </button>
                    </div>
                </form>
            </section>
        </div>)
}
