import { useState, useEffect } from "react";
import { useAuth } from "../auth/useAuth";
import BoardTrainerList from "../components/BoardTrainerList";
import BoardTrainerCreateForm from "../components/BoardTrainerCreateForm";
import { listTrainerNames, createTrainer, getTrainerBoards } from "../firebase/boardConfigs";
import { BoardAdvantage } from "../modules/postflop/BoardAdvantage";
import type { Board } from "../types/config.board";

export default function TrainingBoardPage() {
    const { user } = useAuth();
    const [trainers, setTrainers] = useState<string[]>([]);
    const [selectedTrainer, setSelectedTrainer] = useState<string | null>(null);
    const [boards, setBoards] = useState<Board[]>([]);

    // Charger la liste des trainers à la connexion
    useEffect(() => {
        if (!user) return;
        async function fetchTrainers() {
            const names = await listTrainerNames(user!.uid);
            setTrainers(names);
            setSelectedTrainer(names[0] || null);
        }
        fetchTrainers();
    }, [user]);

    // Charger les boards du trainer sélectionné
    useEffect(() => {
        if (!user || !selectedTrainer) {
            setBoards([]);
            return;
        }
        async function fetchBoards() {
            const result = await getTrainerBoards(user!.uid, selectedTrainer!);
            setBoards(result);
        }
        fetchBoards();
    }, [user, selectedTrainer]);

    // Création d'un nouveau trainer board
    const handleAddTrainer = async (name: string) => {
        if (!user) return;
        await createTrainer(user.uid, name);
        setTrainers(prev => [...prev, name]);
        setSelectedTrainer(name);
    };

    if (!user) return <div>Connectez-vous pour accéder à cette page.</div>;

    return (
        <div>
            <h2>Entraînement reconnaissance boards postflop</h2>

            <BoardTrainerCreateForm onCreate={handleAddTrainer} />

            <h3>Trainers Board existants</h3>
            <BoardTrainerList
                trainers={trainers}
                selected={selectedTrainer}
                onSelect={setSelectedTrainer}
            />

            {!selectedTrainer || boards.length === 0 ? (
                <p>Aucun board dans ce trainer. Ajoutez-en dans la page de configuration.</p>
            ) : (
                <div>
                    <h3>Entraînez-vous sur « {selectedTrainer} »</h3>
                    {/* Ici, tu peux afficher ton BoardAdvantage (ou tout autre composant d’exercice) */}
                    <BoardAdvantage config={boards[0].config} />
                </div>
            )}
        </div>
    );
}
