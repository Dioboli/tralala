// src/auth/SignupForm.tsx
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

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
            await createUserWithEmailAndPassword(auth, email, pw);
            setSuccess(true);
            navigate("/exercices");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erreur inconnue");
        }
    }

    return (
        <form onSubmit={handleSignup}>
            <input
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            <input
                placeholder="Mot de passe"
                type="password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                required
            />
            <button type="submit">Inscription</button>
            {error && <div style={{ color: "red" }}>{error}</div>}
            {success && <div style={{ color: "green" }}>Inscription réussie!</div>}
        </form>
    );
}
