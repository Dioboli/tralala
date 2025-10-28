// /src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCzosOtOMo7WWMq0ynYy-4vjYO1Zu_FFOM",
    authDomain: "knowyourrange-4af90.firebaseapp.com",
    projectId: "knowyourrange-4af90",
    storageBucket: "knowyourrange-4af90.appspot.com",
    messagingSenderId: "801110125579",
    appId: "1:801110125579:web:2a659a148600145473eb0e",
    measurementId: "G-V245XE3C7L"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

// ** Persistance de session ** :
setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
        // Optionnel: affiche une erreur si la persistance n'est pas possible
        console.error("Erreur lors de la définition de la persistance Firebase Auth :", error);
    });
