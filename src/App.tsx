// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TrainingPage from "./pages/TrainingPage";
import ConfigScreen from "./pages/ConfigScreen";
import { AuthProvider } from "./auth/AuthProvider";
import { useAuth } from "./auth/useAuth";
import LoginForm from "./auth/LoginForm";     // Vérifie ce chemin
import SignupForm from "./auth/SignupForm";   // Si tu veux ajouter l'inscription
import ExercicesPage from "./pages/ExercicesPage";
import Header from "./components/Header";

function AppRoutes() {
    const { user } = useAuth();
    return (
        <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            {user ? (
                <>
                    <Route path="/" element={<Navigate to="/training" />} />
                    <Route path="/training" element={<TrainingPage userId={user.uid} />} />
                    <Route path="/config" element={<ConfigScreen userId={user.uid} />} />
                    <Route path="/signup" element={<SignupForm />} />
                    <Route path="/exercices" element={<ExercicesPage />} />
                </>
            ) : (
                <>
                    {/* Optionnel: redirige toutes les autres routes vers login */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </>
            )}
        </Routes>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Header />
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}
