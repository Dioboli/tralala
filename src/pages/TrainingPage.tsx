// /src/pages/TrainingPage.tsx
import { useState, useEffect } from "react";
import { BoardAdvantage } from "../modules/postflop/BoardAdvantage";
import { db } from "../firebase";
import {
    doc,
    getDoc,
    type FirestoreDataConverter,
} from "firebase/firestore";
import type { Config } from "../utils/boardAnalysis"; // ton type Config existant

// --- Firestore converter pour le typage automatique ---
const configConverter: FirestoreDataConverter<Config> = {
    toFirestore(config: Config) {
        return config; // conversion simple ici
    },
    fromFirestore(snapshot) {
        return snapshot.data() as Config;
    },
};

export default function TrainingPage({ userId }: { userId: string }) {
    const [config, setConfig] = useState<Config | null>(null);

    useEffect(() => {
        async function fetchConfig() {
            // Application du converter directement sur la référence Firestore
            const ref = doc(db, "users", userId).withConverter(configConverter);
            const snap = await getDoc(ref);
            setConfig(snap.exists() ? snap.data() : null);
        }

        fetchConfig();
    }, [userId]);

    if (!config) return <div>Chargement config...</div>;

    return (
        <div>
            <h2>Entraînement reconnaissance boards postflop</h2>
            <BoardAdvantage config={config} />
        </div>
    );
}
