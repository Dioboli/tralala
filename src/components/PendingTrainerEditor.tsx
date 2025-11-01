import { useState, useEffect } from "react";
import CardRangeDropdown from "../components/CardRangeDropdown";
import type { Board } from "../types/config.board";
import { createTrainerWithBoards } from "../firebase/boardConfigs";

type PendingTrainerEditorProps = {
    trainerName: string;
    userId: string;
    initialBoards?: Board[];
    onCancel: () => void;
    onSaveSuccess: () => void;
};

export default function PendingTrainerEditor({
    trainerName,
    userId,
    initialBoards = [],
    onCancel,
    onSaveSuccess,
}: PendingTrainerEditorProps) {
    const [boards, setBoards] = useState<Board[]>([]);
    const [newBoardName, setNewBoardName] = useState("");
    const [newBoardRange, setNewBoardRange] = useState({ start: 14, end: 2 });
    const [saving, setSaving] = useState(false);

    // Mise à jour des boards à chaque changement de initialBoards (passage en modification)
    useEffect(() => {
        setBoards(initialBoards);
    }, [initialBoards]);

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
        setBoards([...boards, newBoard]);
        setNewBoardName("");
        setNewBoardRange({ start: 14, end: 2 });
    }

    function updateBoardLocal(boardId: string, newConfig: Board["config"]) {
        setBoards((current) =>
            current.map((b) => (b.id === boardId ? { ...b, config: newConfig } : b))
        );
    }

    function deleteBoardLocal(boardId: string) {
        setBoards((current) => current.filter((b) => b.id !== boardId));
    }

    async function handleSave() {
        if (boards.length === 0) {
            alert("Veuillez ajouter au moins un board avant de sauvegarder.");
            return;
        }
        setSaving(true);
        try {
            await createTrainerWithBoards(userId, trainerName, boards);
            alert("Trainer et boards sauvegardés avec succès !");
            onSaveSuccess();
        } catch (error) {
            if (error instanceof Error) {
                alert("Erreur lors de la sauvegarde : " + error.message);
            } else {
                alert("Erreur inconnue lors de la sauvegarde");
            }
        }
        setSaving(false);
    }

    return (
        <div>
            <h3>{boards.length > 0 ? "Modification" : "Création"} du trainer : {trainerName}</h3>
            <ul>
                {boards.map((board) => (
                    <li key={board.id} style={{ marginBottom: 12 }}>
                        <input
                            type="text"
                            value={board.config.name}
                            onChange={(e) => updateBoardLocal(board.id, { ...board.config, name: e.target.value })}
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
                <h4>Ajouter un board</h4>
                <input
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    placeholder="Nom du board"
                    style={{ marginRight: 8 }}
                />
                <CardRangeDropdown value={newBoardRange} onChange={setNewBoardRange} />
                <button onClick={addBoardLocal} style={{ marginLeft: 8 }}>
                    Ajouter
                </button>
            </div>

            <div style={{ marginTop: 24 }}>
                <button onClick={handleSave} disabled={saving}>
                    {saving ? "Sauvegarde en cours..." : "Enregistrer trainer et boards"}
                </button>
                <button onClick={onCancel} style={{ marginLeft: 12 }} disabled={saving}>
                    Annuler
                </button>
            </div>
        </div>
    );
}
