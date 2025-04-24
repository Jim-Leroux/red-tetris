import React from "react";
import { TETRIMINOS } from "/shared/tetriminos";

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
		<div style={{ margin: 10 }}>
			<p style={{ fontWeight: 'bold', textAlign: 'center' }}>{playerName}</p>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(10, 10px)',
					gridTemplateRows: 'repeat(20, 10px)',
					gap: '1px',
					border: '1px solid #444'
				}}
			>
				{grid.flat().map((cellColor, index) => (
					<div
						key={index}
						style={{
							width: 10,
							height: 10,
							backgroundColor: cellColor || 'transparent',
							border: '1px solid #222'
						}}
					/>
				))}
			</div>
		</div>
	);
}
