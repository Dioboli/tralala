// src/pages/ConfigPage.tsx
import ConfigPage from "../components/ConfigPage"; // si tu sépares le formulaire en composant

export default function ConfigScreen({ userId }: { userId: string }) {
    return (
        <div>
            <h2>Configuration de l'entraînement</h2>
            <ConfigPage userId={userId} />
        </div>
    );
}
