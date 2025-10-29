// src/firebase/boardConfigs.ts
import { db } from "../firebase";
import {
    collection,
    doc,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    type FirestoreDataConverter,
} from "firebase/firestore";
import type { Config } from "../types/config.board"; // Adapte ce chemin à ta base

// --- Firestore converter optionnel pour TS ---
const configConverter: FirestoreDataConverter<Config> = {
    toFirestore(config: Config) {
        return config;
    },
    fromFirestore(snapshot) {
        return snapshot.data() as Config;
    },
};

// --- Ajouter une config ---
export async function createBoardConfig(userId: string, config: Config) {
    const colRef = collection(db, "boardConfigs", userId, "configs").withConverter(configConverter);
    await addDoc(colRef, {
        ...config,
        date: new Date().toISOString(),
    });
}

// --- Récupérer toutes les configs d’un user ---
export async function getUserBoardConfigs(userId: string) {
    const colRef = collection(db, "boardConfigs", userId, "configs").withConverter(configConverter);
    const snap = await getDocs(colRef);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// --- Modifier une config spécifique ---
export async function updateBoardConfig(userId: string, configId: string, updateFields: Partial<Config>) {
    const docRef = doc(db, "boardConfigs", userId, "configs", configId).withConverter(configConverter);
    await updateDoc(docRef, updateFields);
}

// --- Supprimer une config ---
export async function deleteBoardConfig(userId: string, configId: string) {
    const docRef = doc(db, "boardConfigs", userId, "configs", configId).withConverter(configConverter);
    await deleteDoc(docRef);
}
