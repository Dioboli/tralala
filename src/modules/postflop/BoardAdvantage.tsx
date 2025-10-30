// modules/postflop/BoardAdvantage.tsx
import React, { useState } from "react";
import { PokerTable } from "../../components/PokerTable";
import { generateRandomBoard } from "../../utils/generateRandomBoard";
import { guessType } from "../../utils/boardAnalysis";
import type { Config } from "../../types/config.board";

type BoardType = "massif" | "fort" | "faible";

const labels: Record<BoardType, string> = {
    massif: "Massif",
    fort: "Fort",
    faible: "Faible"
};

interface BoardAdvantageProps {
    config: Config;
}

export const BoardAdvantage = ({ config }: BoardAdvantageProps) => {
    const [board, setBoard] = useState<string[]>(generateRandomBoard());
    const [feedback, setFeedback] = useState("");
    const [type, setType] = useState<BoardType>(guessType(board, config));

    // Quand on change de board, on analyse selon la config reçue
    const nextBoard = () => {
        const newBoard = generateRandomBoard();
        setBoard(newBoard);
        setType(guessType(newBoard, config) as BoardType);
        setFeedback("");
    };

    // Vérification réponse utilisateur
    const checkAnswer = (userType: BoardType) => {
        setFeedback(userType === type ? "Bonne réponse !" : "Incorrect !");
        setTimeout(nextBoard, 1200);
    };

    // Met à jour l'affichage quand la config change
    React.useEffect(() => {
        setType(guessType(board, config) as BoardType);
    }, [config, board]);

    return (
        <div>
            <PokerTable board={board} />
            <div>
                {Object.entries(labels).map(([key, label]) => (
                    <button key={key} onClick={() => checkAnswer(key as BoardType)} style={{ margin: 8 }}>
                        {label}
                    </button>
                ))}
            </div>
            <div>{feedback}</div>
            <div style={{ marginTop: 16, color: "#888" }}>
                Explication: Ce board est considéré comme <b>{labels[type]}</b> (selon ta configuration !)
            </div>
        </div>
    );
};
