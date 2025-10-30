// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import TrainingBoardPage from "./pages/TrainingBoardPage";
import ConfigBoardPage from "./pages/ConfigBoardPage";
import ExercicesPage from "./pages/ExercicesPage";
import LoginForm from "./auth/LoginForm";
import SignupForm from "./auth/SignupForm";
import Header from "./components/Header";
import { AuthProvider } from "./auth/AuthProvider";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/signup" element={<SignupForm />} />

                    {/* Toutes les routes privées sont enfants de ProtectedRoute */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Navigate to="/exercices" />} />
                        <Route path="/training-board" element={<TrainingBoardPage />} />
                        <Route path="/config-board" element={<ConfigBoardPage />} />
                        <Route path="/exercices" element={<ExercicesPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
