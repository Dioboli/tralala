// src/auth/AuthProvider.tsx
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "./AuthContext";
import type { User } from "firebase/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, setUser);
        return () => unsub();
    }, []);

    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
