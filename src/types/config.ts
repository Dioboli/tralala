export interface UserBoardType {
    id: string;
    name: string;
    count: number;
    color?: string;
    categories: string[];
}

export interface Config {
    boardTypes: UserBoardType[];
    // ... autres champs si besoin
}
