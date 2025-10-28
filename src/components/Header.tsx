import { useAuth } from "../auth/useAuth";
import { auth } from "../firebase";

export default function Header() {
    const { user } = useAuth();

    if (!user) return null; // Pas de bandeau si pas connecté

    function handleLogout() {
        auth.signOut();
        // Tu peux ajouter une navigation après déconnexion si tu veux
        // navigate("/login")
    }

    return (
        <div style={{
            width: "100%",
            background: "#eee",
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxSizing: "border-box"
        }}>
            <span>Connecté en tant que {user.email}</span>
            <button onClick={handleLogout}>Déconnexion</button>
        </div>
    );
}
