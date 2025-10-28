// src/auth/SignupForm.tsx
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import type { Config } from "../types/config";
import { encodeEmail } from "../utils/emailUtils";

export default function SignupForm() {
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const navigate = useNavigate();

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, pw);
            const docId = encodeEmail(userCred.user.email!);
            const defaultConfig: Config = { boardTypes: [] };
            await setDoc(doc(db, "users", docId), defaultConfig);
            setSuccess(true);
            // Redirige automatiquement vers la page exercices
            navigate("/exercices");
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Erreur inconnue");
        }
    }

    return (
        <form onSubmit={handleSignup}>
            <input
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <input
                placeholder="Mot de passe"
                type="password"
                value={pw}
                onChange={e => setPw(e.target.value)}
            />
            <button type="submit">Inscription</button>
            {error && <div style={{ color: "red" }}>{error}</div>}
            {success && <div style={{ color: "green" }}>Inscription réussie!</div>}
        </form>
    );
}
