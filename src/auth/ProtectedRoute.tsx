// src/auth/ProtectedRoute.tsx
import { useFirebaseUser } from "./useFirebaseUser"; // ou useAuth si déjà codé
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const { user, loading } = useFirebaseUser();

    if (loading) return <div>Chargement...</div>;
    if (!user) return <Navigate to="/login" replace />;

    return <Outlet />;
}
