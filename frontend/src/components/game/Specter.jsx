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
	const color = TETRIMINOS[name]?.option?.color || "gray";

	// Cloner la grille reçue (pour ne pas la muter)
	const grid = baseGrid.map(row => [...row]);

	// Dessiner la pièce active sur la grille (par-dessus les blocs fixés)
	shape.forEach((row, dy) => {
		row.forEach((cell, dx) => {
			const x = position.x + dx;
			const y = position.y + dy;
			if (cell && y >= 0 && y < 20 && x >= 0 && x < 10) {
				grid[y][x] = color;
			}
		});
	});

	return (
		<div className="specter-wrapper">
  <p className="specter-username">{playerName}</p>
  <div className="specter-grid">
    {grid.flat().map((cellColor, index) => (
      <div
        key={index}
        className="specter-cell"
        style={{
          backgroundColor: cellColor || 'transparent'
        }}
      />
    ))}
  </div>
</div>

	);
}
