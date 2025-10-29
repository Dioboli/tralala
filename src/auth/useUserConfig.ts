// src/auth/useUserConfig.ts
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { Config } from "../types/config.board";
import { encodeEmail } from "../utils/emailUtils";

// userEmail obtenu via FirebaseAuth (ex: auth.currentUser.email)
export function useUserConfig(userEmail: string | null) {
    const [config, setConfig] = useState<Config | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userEmail) {
            setLoading(false);
            return;
        }

        async function fetchConfig(email: string) {
            const docId = encodeEmail(email);
            const ref = doc(db, "users", docId);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                setConfig(snap.data() as Config);
            } else {
                await setDoc(ref, { boardTypes: [] });
                setConfig({ boardTypes: [] });
            }
            setLoading(false);
        }

        fetchConfig(userEmail); // On passe toujours l'email "brut"
    }, [userEmail]);

    return { config, setConfig, loading };
}
