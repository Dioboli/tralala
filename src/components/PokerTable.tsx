//import React from 'react';

interface PokerTableProps {
  board: string[];
}

export const PokerTable = ({ board }: PokerTableProps) => (
  <div style={{ border: "2px solid black", padding: 20, borderRadius: 10, margin: 20, width: 260 }}>
    <div>Cartes du Flop :</div>
    <div style={{ fontSize: 32, letterSpacing: 6 }}>
      {board.map((card, idx) => (
        <span key={idx}>{card} </span>
      ))}
    </div>
  </div>
);
