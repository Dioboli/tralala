export interface UserBoardType {
    id: string;
    name: string;
    count: number;
    color?: string;
    categories: string[];
}

export interface Config {
    // Anciennes options
    minHighCardFort: number;
    includePairedInMassif: boolean;
    suitStrictForFort: boolean;
    doubleBroadwayCategory: "massif" | "fort" | "faible";
    monoColorCategory: "massif" | "fort" | "faible";
    tripleBroadwayCategory: "massif" | "fort" | "faible";
    connectDrawsCategory: "massif" | "fort" | "faible";
    gutShotDrawsCategory: "massif" | "fort" | "faible";
    maxGapForConnected: number;
    minHighCardForBroadway: number;

    // Nouveaux ajouts éventuels
    boardTypes: UserBoardType[];
    date: string;
    name: string;
}
