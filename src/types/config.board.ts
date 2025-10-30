// src/types/config.board.ts

export interface Config {
    name: string;           // Nom du board
    minHighCard: number;    // Carte la plus haute (ex: 14 pour A)
    maxLowCard: number;     // Carte la plus basse (ex: 2)
    // Ajoute ici d’autres options au fur et à mesure
}

export interface Board {
    id: string;
    config: Config;
}

export interface TrainerConfig {
    id: string;
    nom: string;            // Nom général du trainer
    boards: Board[];        // Plusieurs boards attachés au trainer
}
