// src/pages/ConfigScreen.tsx
import ConfigPage from "../components/ConfigPage";
import { useFirebaseUser } from "../auth/useFirebaseUser";

export default function ConfigScreen() {
    const { user } = useFirebaseUser();

    if (!user) return <div>Chargement utilisateur...</div>;

    return (
        <div>
            <h2>Configuration de l'entraînement</h2>
            <ConfigPage userId={user.uid} />
        </div>
    );
}
