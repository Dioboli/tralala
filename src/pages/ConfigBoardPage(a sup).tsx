import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import CardRangeDropdown from "../components/CardRangeDropdown";
import type { Board } from "../types/config.board";
import {
    createBoard,
    getTrainerBoards,
    deleteBoard,
} from "../firebase/boardConfigs";
import { ErrorBanner } from "../components/ErrorBanner";
import { useGlobalError } from "../context/useGlobalError";

const defaultRange = { start: 14, end: 2 };

export default function ConfigBoardPage() {
    const { user } = useAuth();
    const { setError } = useGlobalError();
    const { trainerName } = useParams();
    const navigate = useNavigate();

    const [boards, setBoards] = useState<Board[]>([]);
    const [boardsEdited, setBoardsEdited] = useState<Board[]>([]);
    const [newBoardName, setNewBoardName] = useState("");
    const [newBoardRange, setNewBoardRange] = useState(defaultRange);
    const [saving, setSaving] = useState(false);

    const userId = user?.uid || "";

    useEffect(() => {
        if (!userId || !trainerName) return;
        async function fetchBoards() {
            try {
                const result = await getTrainerBoards(userId, trainerName!);
                setBoards(result);
                setBoardsEdited(result);
            } catch (err: unknown) {
                if (err instanceof Error) setError(err.message);
                else setError("Erreur de chargement des boards");
            }
        }
        fetchBoards();
    }, [userId, trainerName, setError]);

    function updateBoardLocal(boardId: string, newConfig: Board["config"]) {
        setBoardsEdited((current) =>
            current.map((b) => (b.id === boardId ? { ...b, config: newConfig } : b))
        );
    }

    function addBoardLocal() {
        if (!newBoardName.trim()) return;
        const newBoard: Board = {
            id: newBoardName.trim(),
            config: {
                name: newBoardName.trim(),
                minHighCard: newBoardRange.start,
                maxLowCard: newBoardRange.end,
            },
        };
        setBoardsEdited((current) => [...current, newBoard]);
        setNewBoardName("");
        setNewBoardRange(defaultRange);
    }

    function deleteBoardLocal(boardId: string) {
        setBoardsEdited((current) => current.filter((b) => b.id !== boardId));
    }

    async function handleSaveAll() {
        if (!userId || !trainerName) return;
        setSaving(true);
        try {
            for (const board of boardsEdited) {
                await createBoard(userId, trainerName, board);
            }
            const deletedBoards = boards.filter(
                (b) => !boardsEdited.some((edited) => edited.id === b.id)
            );
            for (const del of deletedBoards) {
                await deleteBoard(userId, trainerName, del.id);
            }
            setBoards(boardsEdited);
            alert("Tous les changements ont été sauvegardés !");
            navigate("/training-board");
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Erreur lors de la sauvegarde");
        }
        setSaving(false);
    }

    if (!user) return <div>Connectez-vous pour accéder à cette page.</div>;

    return (
        <div>
            <ErrorBanner />
            <h2>Configuration du trainer : {trainerName}</h2>

            <ul>
                {boardsEdited.map((board) => (
                    <li key={board.id} style={{ marginBottom: 12 }}>
                        <input
                            type="text"
                            value={board.config.name}
                            onChange={(e) =>
                                updateBoardLocal(board.id, {
                                    ...board.config,
                                    name: e.target.value,
                                })
                            }
                            style={{ marginRight: 8 }}
                        />
                        <CardRangeDropdown
                            value={{ start: board.config.minHighCard, end: board.config.maxLowCard }}
                            onChange={(range) => updateBoardLocal(board.id, {
                                ...board.config,
                                minHighCard: range.start,
                                maxLowCard: range.end,
                            })}
                        />
                        <button
                            onClick={() => deleteBoardLocal(board.id)}
                            style={{ marginLeft: 8, color: "red" }}
                            title="Supprimer ce board"
                        >
                            Supprimer
                        </button>
                    </li>
                ))}
            </ul>

            <div style={{ border: "1px solid #ddd", padding: 16, marginTop: 16 }}>
                <h4>Ajouter un board au trainer</h4>
                <input
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    placeholder="Nom du board"
                    style={{ marginRight: 8 }}
                />
                <CardRangeDropdown value={newBoardRange} onChange={setNewBoardRange} />
                <button onClick={addBoardLocal} style={{ marginLeft: 8 }}>
                    Ajouter ce board
                </button>
            </div>

            <div style={{ marginTop: 24 }}>
                <button onClick={handleSaveAll} disabled={saving}>
                    {saving ? "Sauvegarde en cours..." : "Sauvegarder tous les changements"}
                </button>
            </div>
        </div>
    );
}
