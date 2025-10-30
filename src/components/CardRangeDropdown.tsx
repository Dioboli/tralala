// src/components/CardRangeDropdown.tsx
import React, { useState } from "react";
import { cards } from "../utils/pokerCards";

export default function CardRangeDropdown({
    value,
    onChange
}: {
    value: { start: number; end: number };
    onChange: (range: { start: number; end: number }) => void;
}) {
    const [start, setStart] = useState(value.start);
    const [end, setEnd] = useState(value.end);

    // Cartes valides pour la fin du range
    const endOptions = cards.filter(card => card.value <= start);

    const handleStartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStart = Number(e.target.value);
        setStart(newStart);
        // ajuste end si besoin
        let newEnd = end;
        if (end > newStart) newEnd = newStart;
        setEnd(newEnd);
        onChange({ start: newStart, end: newEnd });
    };

    const handleEndChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newEnd = Number(e.target.value);
        setEnd(newEnd);
        onChange({ start, end: newEnd });
    };

    return (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span>De</span>
            <select value={start} onChange={handleStartChange}>
                {cards.map(card => (
                    <option key={card.value} value={card.value}>
                        {card.label}
                    </option>
                ))}
            </select>
            <span>à</span>
            <select value={end} onChange={handleEndChange}>
                {endOptions.map(card => (
                    <option key={card.value} value={card.value}>
                        {card.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
