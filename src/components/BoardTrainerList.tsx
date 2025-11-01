type Props = {
    trainers: string[];
    selected: string | null;
    onSelect: (name: string) => void;
    onEdit?: (name: string) => void;
    onDelete?: (name: string) => void;
};
export default function BoardTrainerList({ trainers, selected, onSelect, onEdit, onDelete }: Props) {
    return (
        <ul>
            {trainers.map((trainer) => (
                <li key={trainer} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                        style={{ fontWeight: trainer === selected ? "bold" : "normal" }}
                        onClick={() => onSelect(trainer)}
                    >
                        {trainer}
                    </button>
                    {onEdit && (
                        <button onClick={() => onEdit(trainer)}>
                            Modifier
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => {
                                if (window.confirm(`Voulez-vous vraiment supprimer le trainer "${trainer}" ?`)) {
                                    onDelete(trainer);
                                }
                            }}
                            style={{ color: "red" }}
                        >
                            Supprimer
                        </button>
                    )}
                </li>
            ))}
        </ul>
    );
}
