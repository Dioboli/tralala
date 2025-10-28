export interface Config {
    // Anciennes options
    minHighCardFort: number;
    includePairedInMassif: boolean;
    suitStrictForFort: boolean;

    // Nouvelles options
    doubleBroadwayCategory: "massif" | "fort" | "faible";
    monoColorCategory: "massif" | "fort" | "faible";
    tripleBroadwayCategory: "massif" | "fort" | "faible";

    // Options avancées
    connectDrawsCategory: "massif" | "fort" | "faible";
    gutShotDrawsCategory: "massif" | "fort" | "faible";

    // Configuration des seuils
    maxGapForConnected: number; // par défaut 4
    minHighCardForBroadway: number; // par défaut 10 (pour T,J,Q,K,A)
}


export type BoardType = "massif" | "fort" | "faible";

export function guessType(board: string[], config: Config): BoardType {
    const ranks = board.map(c => c.slice(0, c.length - 1));
    const suits = board.map(c => c.slice(-1));
    const rankValues: { [key: string]: number } = {
        A: 14, K: 13, Q: 12, J: 11, "10": 10,
        "9": 9, "8": 8, "7": 7, "6": 6, "5": 5,
        "4": 4, "3": 3, "2": 2,
    };

    const nums = ranks.map(r => rankValues[r]).sort((a, b) => b - a);
    const isBroadway = (r: string) => ["A", "K", "Q", "J", "10"].includes(r);
    const broadways = ranks.filter(isBroadway);

    const hasLowCard = nums.some(n => n <= 7);

    const isConnected = nums[0] - nums[2] <= 4;
    const isOneGapper =
        Math.abs(nums[0] - nums[1]) === 2 || Math.abs(nums[1] - nums[2]) === 2;
    const isMonoColor = suits[0] === suits[1] && suits[1] === suits[2];
    const isPaired =
        ranks[0] === ranks[1] || ranks[1] === ranks[2] || ranks[0] === ranks[2];
    const isHighBetweenQand8 = nums.every(n => n <= 12 && n >= 8);
    const isLowBoard = nums.every(n => n <= 7);

    const petitesIndexes = ranks
        .map((r, i) => (rankValues[r] <= 7 ? i : null))
        .filter(i => i != null) as number[];

    let suitPetites = false;
    if (petitesIndexes.length === 2) {
        if (suits[petitesIndexes[0]] === suits[petitesIndexes[1]]) {
            suitPetites = true;
        }
    }

    // Ajout : gestion paramétrable
    const isDoubleBroadway = broadways.length === 2;
    if (isMonoColor) return config.monoColorCategory;
    if (isDoubleBroadway) return config.doubleBroadwayCategory;

    // Reste de ta logique
    const isMassif =
        ((ranks.includes("A") || ranks.includes("K")) &&
            broadways.length === 1 &&
            hasLowCard &&
            !isConnected &&
            !isOneGapper &&
            !suitPetites &&
            !ranks.some(
                r => r !== "A" && r !== "K" && ["Q", "J", "10"].includes(r)
            )) ||
        broadways.length >= 2 ||
        isPaired ||
        isMonoColor;

    const isFort =
        ((ranks.includes("A") || ranks.includes("K")) &&
            broadways.length === 1 &&
            hasLowCard &&
            (isConnected || isOneGapper || suitPetites)) ||
        isHighBetweenQand8;

    const isFaible = isLowBoard;

    if (isMassif) return "massif";
    if (isFort) return "fort";
    if (isFaible) return "faible";
    return "fort"; // fallback
}