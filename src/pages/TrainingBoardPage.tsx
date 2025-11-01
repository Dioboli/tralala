import { useState, useEffect } from "react";
import { useAuth } from "../auth/useAuth";
import BoardTrainerList from "../components/BoardTrainerList";
import BoardTrainerCreateForm from "../components/BoardTrainerCreateForm";
import { deleteTrainer, listTrainerNames, getTrainerBoards } from "../firebase/boardConfigs";
import { BoardAdvantage } from "../modules/postflop/BoardAdvantage";
import type { Board } from "../types/config.board";
import PendingTrainerEditor from "../components/PendingTrainerEditor";

export default function TrainingBoardPage() {
    const { user } = useAuth();
    const [trainers, setTrainers] = useState<string[]>([]);
    const [selectedTrainer, setSelectedTrainer] = useState<string | null>(null);
    const [boards, setBoards] = useState<Board[]>([]);
    const [pendingTrainerName, setPendingTrainerName] = useState<string | null>(null);
    const [pendingTrainerBoards, setPendingTrainerBoards] = useState<Board[] | null>(null);

    useEffect(() => {
        if (!user) return;
        async function fetchTrainers() {
            const names = await listTrainerNames(user!.uid);
            setTrainers(names);
            setSelectedTrainer(names[0] || null);
        }
        fetchTrainers();
    }, [user]);

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

    // Création d'un nouveau trainer
    const handleCreatePendingTrainer = (name: string) => {
        setPendingTrainerName(name);
        setPendingTrainerBoards([]);
    };

    // Modification d'un trainer existant
    const handleEditTrainer = async (name: string) => {
        if (!user) return;
        const boards = await getTrainerBoards(user.uid, name);
        setPendingTrainerName(name);
        setPendingTrainerBoards(boards);
    };

    const handleCancelPending = () => {
        setPendingTrainerName(null);
        setPendingTrainerBoards(null);
    };

    const handleSaveSuccess = async () => {
        setPendingTrainerName(null);
        setPendingTrainerBoards(null);
        if (!user) return;
        const names = await listTrainerNames(user.uid);
        setTrainers(names);
        setSelectedTrainer(names[0] || null);
    };

    const handleSelectTrainer = async (name: string) => {
        setSelectedTrainer(name);
    };

    const handleDeleteTrainer = async (trainerName: string) => {
        if (!user) return;
        try {
            await deleteTrainer(user.uid, trainerName);
            const names = await listTrainerNames(user.uid);
            setTrainers(names);
            if (selectedTrainer === trainerName) setSelectedTrainer(null);
            alert(`Trainer "${trainerName}" supprimé.`);
        } catch (error) {
            alert(`Erreur lors de la suppression : ${(error instanceof Error) ? error.message : error}`);
        }
    };

    if (!user) return <div>Connectez-vous pour accéder à cette page.</div>;

    return (
        <div>
            <h2>Entraînement reconnaissance boards postflop</h2>

            {!pendingTrainerName ? (
                <>
                    <BoardTrainerCreateForm onCreate={handleCreatePendingTrainer} />
                    <BoardTrainerList
                        trainers={trainers}
                        selected={selectedTrainer}
                        onSelect={handleSelectTrainer}
                        onEdit={handleEditTrainer}
                        onDelete={handleDeleteTrainer}
                    />
                    {!selectedTrainer || boards.length === 0 ? (
                        <p>Aucun board dans ce trainer. Ajoutez-en dans la page de configuration.</p>
                    ) : (
                        <div>
                            <h3>Entraînez-vous sur « {selectedTrainer} »</h3>
                            <BoardAdvantage config={boards[0].config} />
                        </div>
                    )}
                </>
            ) : (
                <PendingTrainerEditor
                    trainerName={pendingTrainerName}
                    userId={user.uid}
                    initialBoards={pendingTrainerBoards || []}
                    onCancel={handleCancelPending}
                    onSaveSuccess={handleSaveSuccess}
                />
            )}
        </div>
    );
}
