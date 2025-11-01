// src/TestFirebase.tsx
import { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function TestFirebase() {
    const [value, setValue] = useState("");
    const [status, setStatus] = useState("...");

    async function writeTest() {
        setStatus("Écriture...");
        await setDoc(doc(db, "test", "demo"), { hello: "world" });
        setStatus("Donnée écrite !");
    }

    async function readTest() {
        setStatus("Lecture...");
        const snap = await getDoc(doc(db, "test", "demo"));
        if (snap.exists()) setValue(JSON.stringify(snap.data()));
        setStatus("Lecture OK !");
    }

    return (
        <div>
            <button onClick={writeTest}>Test Write</button>
            <button onClick={readTest}>Test Read</button>
            <div>Status : {status}</div>
            <div>Valeur Firestore : {value}</div>
        </div>
    );
}
