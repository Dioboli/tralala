// src/auth/useUserConfig.ts
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import type { Config } from "../types/config.board";

// userUid obtenu via FirebaseAuth (ex: auth.currentUser.uid)
export function useUserConfig(userUid: string | null) {
    const [config, setConfig] = useState<Config | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userUid) {
            setLoading(false);
            return;
        }

        async function fetchConfig(uid: string) {
            const ref = doc(db, "boardConfigs", uid); // clé = uid direct
            const snap = await getDoc(ref);
            if (snap.exists()) {
                setConfig(snap.data() as Config);
            } else {
                setConfig(null);
            }
            setLoading(false);
        }

        fetchConfig(userUid);
    }, [userUid]);

    return { config, setConfig, loading };
}
