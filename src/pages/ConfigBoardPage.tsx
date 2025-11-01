import { useState, useEffect } from "react";
import { useAuth } from "../auth/useAuth";
import CardRangeDropdown from "../components/CardRangeDropdown";
import type { Board } from "../types/config.board";
import {
    createBoard,
    getTrainerBoards,
    deleteBoard,
    listTrainerNames,
    createTrainer,
} from "../firebase/boardConfigs";
import { ErrorBanner } from "../components/ErrorBanner";
import { useGlobalError } from "../context/useGlobalError"; // <-- AJOUT

const defaultRange = { start: 14, end: 2 };

export default function ConfigBoardPage() {
    const { user } = useAuth();
    const { setError } = useGlobalError(); // <-- AJOUT
    const [trainerNames, setTrainerNames] = useState<string[]>([]);
    const [selectedTrainer, setSelectedTrainer] = useState<string | null>(null);
    const [newTrainerName, setNewTrainerName] = useState("");
    const [boards, setBoards] = useState<Board[]>([]);
    const [newBoardName, setNewBoardName] = useState("");
    const [newBoardRange, setNewBoardRange] = useState(defaultRange);

    const userId = user?.uid || "";

    useEffect(() => {
        if (!userId) return;
        async function fetchTrainers() {
            try {
                const names = await listTrainerNames(userId);
                setTrainerNames(names);
            } catch (err: unknown) {
                if (err instanceof Error) setError(err.message);
                else setError("Erreur de chargement trainers");
            }
        }
        fetchTrainers();
    }, [userId, setError]);

    useEffect(() => {
        if (!userId || !selectedTrainer) {
            setBoards([]);
            return;
        }
        async function fetchBoards() {
            try {
                const result = await getTrainerBoards(userId, selectedTrainer!);
                setBoards(result);
            } catch (err: unknown) {
                if (err instanceof Error) setError(err.message);
                else setError("Erreur de chargement des boards");
            }
        }
        fetchBoards();
    }, [userId, selectedTrainer, setError]);

    const handleAddTrainer = async () => {
        try {
            if (!userId || !newTrainerName.trim()) return;
            await createTrainer(userId, newTrainerName.trim());
            setTrainerNames([...trainerNames, newTrainerName.trim()]);
            setNewTrainerName("");
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Erreur création trainer");
        }
    };

    const handleAddBoard = async () => {
        try {
            if (!userId || !selectedTrainer || !newBoardName.trim()) return;
            const board: Board = {
                id: newBoardName.trim(),
                config: {
                    name: newBoardName.trim(),
                    minHighCard: newBoardRange.start,
                    maxLowCard: newBoardRange.end
                }
            };
            await createBoard(userId, selectedTrainer, board);
            setBoards([...boards, board]);
            setNewBoardName("");
            setNewBoardRange(defaultRange);
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Erreur création board");
        }
    };

    const handleDeleteBoard = async (boardId: string) => {
        try {
            if (!userId || !selectedTrainer) return;
            await deleteBoard(userId, selectedTrainer, boardId);
            setBoards(boards.filter(b => b.id !== boardId));
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Erreur suppression board");
        }
    };

    if (!user) return <div>Connectez-vous pour accéder à cette page.</div>;

    return (
        <div>
            <ErrorBanner /> {/* Affiche l’erreur globale le cas échéant */}
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
                    {trainerNames.map(name => (
                        <li key={name}>
                            <button
                                onClick={() => setSelectedTrainer(name)}
                                style={{ fontWeight: selectedTrainer === name ? "bold" : "normal" }}
                            >
                                {name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Affichage des boards du trainer sélectionné et ajout */}
            {selectedTrainer && (
                <div style={{ marginTop: 32 }}>
                    <h3>Boards pour « {selectedTrainer} »</h3>
                    <ul>
                        {boards.map(board => (
                            <li key={board.id}>
                                <b>{board.config.name} :</b> Range {board.config.minHighCard} à {board.config.maxLowCard}
                                <button style={{ marginLeft: 16 }} onClick={() => handleDeleteBoard(board.id)}>Supprimer</button>
                            </li>
                        ))}
                    </ul>
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
