// src/firebase/boardConfigs.ts
import { db } from "../firebase";
import {
    collection,
    doc,
    setDoc,
    getDocs,
    deleteDoc,
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
