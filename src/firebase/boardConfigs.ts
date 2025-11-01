// src/firebase/boardConfigs.ts
import { db } from "../firebase";
import {
    collection,
    doc,
    setDoc,
    getDocs,
    deleteDoc,
    writeBatch,
} from "firebase/firestore";
import type { Board } from "../types/config.board";

// --- Créer un trainer (en réalité, un document avec l'id du nom du trainer) ---
export async function createTrainer(userId: string, trainerName: string) {
    // trainerName = id du document dans la collection "configs"
    await setDoc(
        doc(db, "boardConfigs", userId, "configs", trainerName),
        { createdAt: Date.now() }
    );
}

// --- Créer un board pour un trainer ---
export async function createBoard(userId: string, trainerName: string, board: Board) {
    // boards est une sous-collection du trainer
    await setDoc(
        doc(db, "boardConfigs", userId, "configs", trainerName, "boards", board.id),
        board
    );
}

// --- Créer trainer + tableaux en une seule transaction atomique ---
export async function createTrainerWithBoards(userId: string, trainerName: string, boards: Board[]) {
    if (!trainerName || !boards.length) throw new Error("Le nom du trainer et au moins un board sont requis");

    const trainerRef = doc(db, "boardConfigs", userId, "configs", trainerName);
    const batch = writeBatch(db);

    // Créer ou mettre à jour le document trainer
    batch.set(trainerRef, { createdAt: Date.now(), trainerName });

    // Créer chaque board dans la sous-collection "boards"
    boards.forEach(board => {
        const boardRef = doc(db, "boardConfigs", userId, "configs", trainerName, "boards", board.id);
        batch.set(boardRef, board);
    });

    await batch.commit();
}

// --- Récupérer tous les boards d’un trainer ---
export async function getTrainerBoards(userId: string, trainerName: string): Promise<Board[]> {
    const colRef = collection(db, "boardConfigs", userId, "configs", trainerName, "boards");
    const snap = await getDocs(colRef);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Board));
}

// --- Supprimer un board ---
export async function deleteBoard(userId: string, trainerName: string, boardId: string) {
    await deleteDoc(doc(db, "boardConfigs", userId, "configs", trainerName, "boards", boardId));
}

// --- Lister tous les noms de trainers d’un user ---
export async function listTrainerNames(userId: string): Promise<string[]> {
    const colRef = collection(db, "boardConfigs", userId, "configs");
    const snap = await getDocs(colRef);
    return snap.docs.map(doc => doc.id);
}

export async function deleteTrainer(userId: string, trainerName: string) {
    const trainerRef = doc(db, "boardConfigs", userId, "configs", trainerName);
    const boardsCol = collection(trainerRef, "boards");
    // Supprimer tous les boards d'abord
    const boardsSnapshot = await getDocs(boardsCol);
    const promises = boardsSnapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(promises);
    // Supprimer ensuite le doc trainer
    await deleteDoc(trainerRef);
}