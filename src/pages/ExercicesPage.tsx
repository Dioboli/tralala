import { Link } from "react-router-dom";

export default function ExercicesPage() {
    // Plus tard tu rendras ça dynamique (ex: via Firestore)
    return (
        <div>
            <h2>Exercices disponibles</h2>
            <ul>
                <li><Link to="/training-board">Board Training</Link></li>
                {/* D'autres lignes ici */}
            </ul>
        </div>
    );
}
