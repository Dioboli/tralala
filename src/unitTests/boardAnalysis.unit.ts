// src/unitTests/boardAnalysis.unit.ts
import { guessType } from "../utils/boardAnalysis";
import type { Config } from "../types/config.board";

const config: Config = { name: "standard", minHighCard: 14, maxLowCard: 2 };

export const boardTests = [
    {
        name: 'As Kd 7h gives "massif"',
        test: () => guessType(["As", "Kd", "7h"], config) === "massif"
    },
    {
        name: 'Qc 8d 3h gives "fort"',
        test: () => guessType(["Qc", "8d", "3h"], config) === "fort"
    },
    {
        name: '4s 5c 9d gives "faible"',
        test: () => guessType(["4s", "5c", "9d"], config) === "faible"
    }
];
