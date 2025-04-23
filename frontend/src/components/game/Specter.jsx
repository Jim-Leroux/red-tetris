import React from "react";
import { TETRIMINOS } from "../../logic/tetriminos";

export default function Specter({ playerName, specterData }) {
	if (!specterData || !specterData.name || !specterData.shape || !specterData.position) return null;

	const { name, shape, position } = specterData;
	const color = TETRIMINOS[name]?.option?.color || "gray";

	// Créer une grille vide 10x20
	const grid = Array.from({ length: 20 }, () => Array(10).fill(null));

	// Dessiner la pièce dans la grille
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
