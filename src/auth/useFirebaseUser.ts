// src/auth/useFirebaseUser.tsx
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../firebase";

export function useFirebaseUser() {
    const [user, setUser] = useState<User | null>(null);   // << Typage correct
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);        // firebaseUser: User | null
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    return { user, loading };
}
