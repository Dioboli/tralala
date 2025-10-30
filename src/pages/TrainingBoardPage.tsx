import { useState, useEffect } from "react";
import { BoardAdvantage } from "../modules/postflop/BoardAdvantage";
import { db } from "../firebase";
import {
    collection,
    getDocs,
    type FirestoreDataConverter
} from "firebase/firestore";
import { useFirebaseUser } from "../auth/useFirebaseUser";
import type { TrainerConfig } from "../types/config.board";

const trainerConverter: FirestoreDataConverter<TrainerConfig> = {
    toFirestore(trainer: TrainerConfig) {
        return trainer;
    },
    fromFirestore(snapshot) {
        return snapshot.data() as TrainerConfig;
    },
};

export default function TrainingBoardPage() {
    const { user } = useFirebaseUser();
    const [trainers, setTrainers] = useState<TrainerConfig[]>([]);
    const [selectedTrainer, setSelectedTrainer] = useState<TrainerConfig | null>(null);

    useEffect(() => {
        if (!user) return;
        async function fetchTrainers() {
            const colRef = collection(db, "users", user!.uid, "trainers").withConverter(trainerConverter);
            const snap = await getDocs(colRef);
            const loaded = snap.docs.map(d => ({ ...d.data(), id: d.id }));
            setTrainers(loaded);
            // Optionnel: sélectionner le premier trainer au chargement
            setSelectedTrainer(loaded[0] ?? null);
        }
        fetchTrainers();
    }, [user]);

    if (!user) return <div>Chargement utilisateur...</div>;

    // Affiche un lien vers la page de config si aucun trainer existe
    if (trainers.length === 0) {
        return (
            <div>
                <h2>Entraînement reconnaissance boards postflop</h2>
                <p>Aucun trainer configuré pour le moment.</p>
                <a href="/config-board">Créer un trainer</a>
            </div>
        );
    }

    return (
        <div>
            <h2>Mes trainers board</h2>
            <ul style={{ marginBottom: 16 }}>
                {trainers.map((trainer) => (
                    <li key={trainer.id}>
                        <button
                            onClick={() => setSelectedTrainer(trainer)}
                            style={{ marginRight: 8, fontWeight: trainer.id === selectedTrainer?.id ? "bold" : "normal" }}
                        >
                            {trainer.nom}
                        </button>
                    </li>
                ))}
            </ul>
            <a href="/trainer-config">Gérer/Créer un trainer</a>
            {selectedTrainer && (
                <BoardAdvantage config={selectedTrainer.config} />
            )}
        </div>
    );
}
