import React from "react";
import { TETRIMINOS } from "../../logic/tetriminos";

export default function Specter({ playerName, specterData }) {
  if (
    !specterData ||
    !specterData.name ||
    !specterData.shape ||
    !specterData.position ||
    !specterData.grid
  ) return null;

  const { name, shape, position, grid: baseGrid } = specterData;

  // Fonction pour convertir une cellule en couleur CSS
  function getCellColor(cell) {
    if (!cell) return 'transparent';
    if (typeof cell === 'object') {
      const color = TETRIMINOS[cell.name]?.option?.color;
      return color || 'gray';
    }
    if (cell === 9) return '#444'; // ligne de pénalité
    return 'transparent';
  }

  // Clone de la grille pour y dessiner la pièce active
  const grid = baseGrid.map(row => [...row]);

  // Injecte la pièce actuelle dans la grille pour l'affichage
 shape.forEach((row, dy) => {
  row.forEach((cell, dx) => {
    const x = position.x + dx;
    const y = position.y + dy;
    if (cell && y >= 0 && y < 20 && x >= 0 && x < 10) {
      // Remplace uniquement si la cellule est vide ou un trou (0)
      if (grid[y][x] === 0 || grid[y][x] === null || grid[y][x] === undefined) {
        grid[y][x] = { name };
      }
    }
  });
});


  return (
    <div className="specter-wrapper">
      <p className="specter-username">{playerName}</p>
      <div className="specter-grid">
        {grid.flat().map((cell, index) => (
          <div
            key={index}
            className="specter-cell"
            style={{
              backgroundColor: getCellColor(cell)
            }}
          />
        ))}
      </div>
    </div>
  );
}
