// src/auth/LoginForm.tsx
import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, pw);
            // Redirige vers la page des exercices après connexion
            navigate("/exercices");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Erreur inconnue lors de la connexion");
            }
        }
    }

    return (
        <form onSubmit={handleLogin}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Mot de passe"
                value={pw}
                onChange={e => setPw(e.target.value)}
                required
            />
            <button type="submit">Connexion</button>
            {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
            <div style={{ marginTop: 10 }}>
                Pas de compte ? <a href="/signup">Inscrivez-vous ici</a>
            </div>
        </form>
    );
}
