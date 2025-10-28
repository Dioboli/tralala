// Génère un board aléatoire (ex: 3 cartes du flop)
const suits = ["h", "d", "c", "s"];
const ranks = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];

function getRandomCard(used: string[]): string {
    let card = "";
    do {
        const rank = ranks[Math.floor(Math.random() * ranks.length)];
        const suit = suits[Math.floor(Math.random() * suits.length)];
        card = rank + suit;
    } while (used.includes(card));
    return card;
}

export function generateRandomBoard(): string[] {
    const board: string[] = [];
    while (board.length < 3) {  // pour un flop de 3 cartes
        board.push(getRandomCard(board));
    }
    return board;
}
