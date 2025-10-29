// src/pages/ConfigPage.tsx
import { useEffect } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import type { Config } from "../types/config.board";
import { encodeEmail } from "../utils/emailUtils";
import { useUserConfig } from "../auth/useUserConfig";
import { useAuth } from "../auth/useAuth"; // ou ta méthode pour récupérer l'utilisateur

// Valeur par défaut à centraliser éventuellement
const defaultConfig: Config = {
    minHighCardFort: 8,
    includePairedInMassif: true,
    suitStrictForFort: true,
    doubleBroadwayCategory: "massif",
    monoColorCategory: "massif",
    tripleBroadwayCategory: "massif",
    connectDrawsCategory: "fort",
    gutShotDrawsCategory: "faible",
    maxGapForConnected: 4,
    minHighCardForBroadway: 10,
    boardTypes: [],
    date: new Date().toISOString()
};

export default function ConfigPage() {
    const { user } = useAuth(); // ou ta méthode pour avoir l'utilisateur
    const { config, setConfig, loading } = useUserConfig(user?.email ?? null);

    useEffect(() => {
        // Créer la config si elle n'existe pas et que l'utilisateur est connecté
        async function initializeConfig() {
            if (!config && user?.email) {
                const docId = encodeEmail(user.email);
                const ref = doc(db, "boardConfigs", docId);
                await setDoc(ref, defaultConfig);
                setConfig(defaultConfig);
            }
        }

        if (!loading) {
            initializeConfig();
        }
    }, [config, user?.email, loading, setConfig]);

    if (loading) {
        return <div>Chargement de la configuration...</div>;
    }

    if (!user) {
        return <div>Vous devez être connecté pour accéder à cette page.</div>;
    }

    return (
        <div>
            <h2>Configuration</h2>
            {config ? (
                <div>
                    <h3>Configuration trouvée :</h3>
                    <pre>{JSON.stringify(config, null, 2)}</pre>
                </div>
            ) : (
                <div>Initialisation de la configuration...</div>
            )}
        </div>
    );
}
