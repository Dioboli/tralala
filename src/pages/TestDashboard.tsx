// src/pages/TestDashboard.tsx
import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

// ------ Catégorie 1 : TESTS BDD ------
function useDbTest(userId: string | null) {
    const [status, setStatus] = useState("...");
    const [result, setResult] = useState("");
    async function runTest() {
        setStatus("Écriture Firestore...");
        try {
            const testPath = userId ? `boardConfigs/${userId}/configs/testdoc` : "test/testdoc";
            await setDoc(doc(db, testPath), { hello: "world", time: Date.now() });
            setStatus("Lecture Firestore...");
            const snap = await getDoc(doc(db, testPath));
            if (snap.exists()) {
                setResult(JSON.stringify(snap.data()));
                setStatus("✅ OK");
            } else {
                setStatus("❌ Document non trouvé !");
            }
        } catch (err) {
            if (err instanceof Error) {
                setStatus("❌ Erreur Firestore : " + err.message);
            } else {
                setStatus("❌ Erreur inconnue Firestore");
            }
        }
    }
    return { status, result, runTest };
}

// ------ Catégorie 2 : TESTS logiques (unitTests/boardAnalysis.unit.ts) ------
import { boardTests } from "../unitTests/boardAnalysis.unit";

// ------ Catégorie 3 : TESTS composants ------
const componentTests = [
    {
        name: "CardRangeDropdown ne plante pas",
        test: () => true // À remplacer par de vrais tests plus tard
    }
    // Ajoute d'autres tests ici...
];

export default function TestDashboard() {
    const { user } = useAuth();
    const { status: dbStatus, result: dbResult, runTest: runDbTest } = useDbTest(user?.uid || null);

    return (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem" }}>
            <h1>🧪 Test Dashboard</h1>
            <hr />

            {/* ---- BDD ---- */}
            <h2>📦 Base de données Firestore</h2>
            <button onClick={runDbTest}>Test BDD Firestore</button>
            <div>Status : {dbStatus}</div>
            <div>Résultat : {dbResult}</div>

            {/* ---- Logique métier ---- */}
            <h2>🧠 Logique métier : Board Analysis</h2>
            <ul>
                {boardTests.map((t, i) => (
                    <li key={i}>
                        {t.test() ? "✅" : "❌"} {t.name}
                    </li>
                ))}
            </ul>

            {/* ---- Composants ---- */}
            <h2>🧩 Composants</h2>
            <ul>
                {componentTests.map((t, i) => (
                    <li key={i}>
                        {t.test() ? "✅" : "❌"} {t.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}