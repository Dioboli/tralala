import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { useAuth } from "../auth/useAuth";
import CardRangeDropdown from "../components/CardRangeDropdown";
import type { TrainerConfig, Board } from "../types/config.board";
import { v4 as uuid } from "uuid";

const defaultRange = { start: 14, end: 2 };

export default function ConfigBoardPage() {
    const { user } = useAuth();
    const [trainers, setTrainers] = useState<TrainerConfig[]>([]);
    const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(null);
    const [newTrainerName, setNewTrainerName] = useState("");
    const [newBoardName, setNewBoardName] = useState("");
    const [newBoardRange, setNewBoardRange] = useState(defaultRange);

    // Charger les trainers
    useEffect(() => {
        if (!user || !user.email) return;
        const email = user.email;

        async function fetchTrainers() {
            const colRef = collection(db, "users", email, "trainers");
            const snap = await getDocs(colRef);
            const allTrainers = snap.docs.map(tr => ({
                id: tr.id,
                ...tr.data()
            })) as TrainerConfig[];
            setTrainers(allTrainers);
        }
        fetchTrainers();
    }, [user]);

    // Ajout d'un trainer
    const handleAddTrainer = async () => {
        if (!user || !user.email || !newTrainerName.trim()) return;
        const email = user.email;
        const id = uuid();
        const trainer: TrainerConfig = { id, nom: newTrainerName, boards: [] };
        await setDoc(doc(db, "users", email, "trainers", id), trainer);
        setTrainers([...trainers, trainer]);
        setNewTrainerName("");
    };

    // Sélectionner un trainer
    const selectedTrainer = trainers.find(tr => tr.id === selectedTrainerId);

    // Ajouter un nouveau board au trainer sélectionné
    const handleAddBoard = async () => {
        if (!selectedTrainer || !newBoardName.trim()) return;
        const board: Board = {
            id: uuid(),
            config: {
                name: newBoardName,
                minHighCard: newBoardRange.start,
                maxLowCard: newBoardRange.end
            }
        };
        const updatedTrainer = {
            ...selectedTrainer,
            boards: [...selectedTrainer.boards, board]
        };
        if (!user || !user.email) {
            console.error("L'utilisateur n'est pas connecté ou l'email est indisponible");
            return; // ou gérer autrement
        }

        const email = user.email; // TS comprend que email est string non nul ici
        await setDoc(doc(db, "users", email, "trainers", updatedTrainer.id), updatedTrainer);
        setTrainers(trainers.map(t => t.id === updatedTrainer.id ? updatedTrainer : t));
        setNewBoardName("");
        setNewBoardRange(defaultRange);
    };

    if (!user) return <div>Connectez-vous pour accéder à cette page.</div>;

    return (
        <div>
            <h2>Gestion des Trainers et Boards</h2>

            {/* Création d’un nouveau trainer */}
            <div style={{ marginBottom: 24 }}>
                <input
                    value={newTrainerName}
                    onChange={e => setNewTrainerName(e.target.value)}
                    placeholder="Nom du nouveau trainer"
                />
                <button onClick={handleAddTrainer}>Créer un Trainer</button>
            </div>

            {/* Liste des trainers existants */}
            <div>
                <h3>Trainers existants</h3>
                <ul>
                    {trainers.map(tr => (
                        <li key={tr.id}>
                            <button
                                onClick={() => setSelectedTrainerId(tr.id)}
                                style={{
                                    fontWeight: selectedTrainerId === tr.id ? "bold" : "normal"
                                }}
                            >
                                {tr.nom}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Affichage du trainer sélectionné et ajout/modif de boards */}
            {selectedTrainer && (
                <div style={{ marginTop: 32 }}>
                    <h3>Boards pour « {selectedTrainer.nom} »</h3>
                    <ul>
                        {selectedTrainer.boards.map(board => (
                            <li key={board.id}>
                                <b>{board.config.name} :</b> Range {board.config.minHighCard} à {board.config.maxLowCard}
                            </li>
                        ))}
                    </ul>
                    {/* Ajout d'un nouveau board */}
                    <div style={{ border: "1px solid #ddd", padding: 16, marginTop: 16 }}>
                        <h4>Ajouter un board au trainer</h4>
                        <input
                            value={newBoardName}
                            onChange={e => setNewBoardName(e.target.value)}
                            placeholder="Nom du board"
                        />
                        <CardRangeDropdown
                            value={newBoardRange}
                            onChange={setNewBoardRange}
                        />
                        <button onClick={handleAddBoard}>Ajouter ce board</button>
                    </div>
                </div>
            )}
        </div>
    );
}
