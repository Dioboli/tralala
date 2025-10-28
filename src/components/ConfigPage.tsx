import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // adapte le chemin si besoin
import { doc, setDoc } from "firebase/firestore";
import type { Config, BoardType } from "../utils/boardAnalysis";

const defaultConfig: Config = {
    minHighCardFort: 8,
    includePairedInMassif: true,
    suitStrictForFort: true,

    // Nouvelles valeurs par défaut
    doubleBroadwayCategory: "massif",
    monoColorCategory: "massif",
    tripleBroadwayCategory: "fort",

    connectDrawsCategory: "fort",
    gutShotDrawsCategory: "faible",

    maxGapForConnected: 4,
    minHighCardForBroadway: 10
};


export default function ConfigPage({ userId }: { userId: string }) {
    const [config, setConfig] = useState(defaultConfig);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Test direct sans Firebase");
        setConfig({
            minHighCardFort: 8,
            includePairedInMassif: true,
            suitStrictForFort: true,

            // Ajoute les valeurs manquantes
            doubleBroadwayCategory: "massif",
            monoColorCategory: "massif",
            tripleBroadwayCategory: "fort",

            connectDrawsCategory: "fort",
            gutShotDrawsCategory: "faible",

            maxGapForConnected: 4,
            minHighCardForBroadway: 10
        });
        setLoading(false);
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await setDoc(doc(db, "config", userId), config);
        alert("Configuration sauvegardée !");
    }

    if (loading) return <div>Chargement...</div>;

    return (
        <form onSubmit={handleSubmit}>
            {/* Champs existants */}
            <label>
                High card minimum pour "fort" :
                <input
                    type="number"
                    min={7}
                    max={12}
                    value={config.minHighCardFort}
                    onChange={e => setConfig({ ...config, minHighCardFort: +e.target.value })}
                />
            </label>
            <br />

            {/* Nouveaux champs */}
            <label>
                Catégorie pour double Broadway (ex: AK4) :
                <select
                    value={config.doubleBroadwayCategory}
                    onChange={e => setConfig({ ...config, doubleBroadwayCategory: e.target.value as BoardType })}
                >
                    <option value="massif">Massif</option>
                    <option value="fort">Fort</option>
                    <option value="faible">Faible</option>
                </select>
            </label>
            <br />

            <label>
                Catégorie pour boards monocolor :
                <select
                    value={config.monoColorCategory}
                    onChange={e => setConfig({ ...config, monoColorCategory: e.target.value as BoardType })}
                >
                    <option value="massif">Massif</option>
                    <option value="fort">Fort</option>
                    <option value="faible">Faible</option>
                </select>
            </label>
            <br />

            <label>
                Catégorie pour triple Broadway (ex: AKQ) :
                <select
                    value={config.tripleBroadwayCategory}
                    onChange={e => setConfig({ ...config, tripleBroadwayCategory: e.target.value as BoardType })}
                >
                    <option value="massif">Massif</option>
                    <option value="fort">Fort</option>
                    <option value="faible">Faible</option>
                </select>
            </label>
            <br />

            <button type="submit">Sauvegarder</button>
        </form>
    );

}
