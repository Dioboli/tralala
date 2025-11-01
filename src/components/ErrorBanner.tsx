// src/components/ErrorBanner.tsx
import { useGlobalError } from "../context/useGlobalError";

export function ErrorBanner() {
    const { error, setError } = useGlobalError();

    if (!error) return null;

    const closeError = () => setError(null);

    return (
        <div
            data-testid="error-banner"
            role="alert"
            style={{ background: "red", color: "white", padding: "1rem", cursor: "pointer", marginBottom: "1rem" }}
            title="Cliquer pour fermer"
            onClick={closeError}
        >
            {error}
        </div>
    );
}

