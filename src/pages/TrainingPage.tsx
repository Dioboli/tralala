// /src/pages/TrainingPage.tsx
import { useState, useEffect } from "react";
import { BoardAdvantage } from "../modules/postflop/BoardAdvantage";
import { db } from "../firebase";
import {
    doc,
    getDoc,
    type FirestoreDataConverter,
} from "firebase/firestore";
import type { Config } from "../utils/boardAnalysis";
import { useFirebaseUser } from "../auth/useFirebaseUser";

// --- Firestore converter pour le typage automatique ---
const configConverter: FirestoreDataConverter<Config> = {
    toFirestore(config: Config) {
        return config;
    },
    fromFirestore(snapshot) {
        return snapshot.data() as Config;
    },
};

export default function TrainingPage() {
    const { user } = useFirebaseUser();
    const [config, setConfig] = useState<Config | null>(null);

    useEffect(() => {
        if (!user) return; // Ne fait rien tant qu’on n’a pas l’utilisateur

        async function fetchConfig() {
            const ref = doc(db, "users", user!.uid).withConverter(configConverter);
            const snap = await getDoc(ref);
            setConfig(snap.exists() ? snap.data() : null);
        }

        fetchConfig();
    }, [user]);

    if (!user) return <div>Chargement utilisateur...</div>;
    if (!config) return <div>Chargement config...</div>;

    return (
        <div>
            <h2>Entraînement reconnaissance boards postflop</h2>
            <BoardAdvantage config={config} />
        </div>
    );
}
