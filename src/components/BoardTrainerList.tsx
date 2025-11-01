type Props = {
    trainers: string[];
    selected: string | null;
    onSelect: (name: string) => void;
};
export default function BoardTrainerList({ trainers, selected, onSelect }: Props) {
    return (
        <ul>
            {trainers.map(name => (
                <li key={name}>
                    <button
                        onClick={() => onSelect(name)}
                        style={{ fontWeight: selected === name ? "bold" : "normal" }}
                    >
                        {name}
                    </button>
                </li>
            ))}
        </ul>
    );
}
