// src/components/ConfigPage.tsx
import React, { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import type { Config } from "../types/config.board";

// Ajoute un champ pour le nom
export default function ConfigPage({ userId }: { userId: string }) {
    const [config, setConfig] = useState<Config>({
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
        date: new Date().toISOString(),
        name: "Ma configuration par défaut" // ⇦ OBLIGATOIRE désormais
    });
    const [configName, setConfigName] = useState(""); // champ pour saisir le nom
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const configId = Date.now().toString(); // id unique basé sur la date
        await setDoc(doc(db, "boardConfigs", userId + "-" + configId), {
            ...config,
            name: configName
        });
        setLoading(false);
        alert("Configuration sauvegardée !");
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                placeholder="Nom de la config"
                value={configName}
                onChange={e => setConfigName(e.target.value)}
                required
            />
            {/* ...les autres champs comme avant... */}
            <button type="submit" disabled={loading}>
                Sauvegarder
            </button>
        </form>
    );
}
