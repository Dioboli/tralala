import { useState } from "react";
type Props = { onCreate: (name: string) => void };
export default function BoardTrainerCreateForm({ onCreate }: Props) {
    const [name, setName] = useState("");
    return (
        <div>
            <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nom du nouveau board trainer"
            />
            <button
                onClick={() => {
                    if (name.trim()) {
                        onCreate(name.trim());
                        setName("");
                    }
                }}
            >
                Créer un Trainer Board
            </button>
        </div>
    );
}
