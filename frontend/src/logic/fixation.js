export default function fixPieceToGrid(grid, shape, position, piece) {
	const newGrid = grid.map(row => [...row]);

	shape.forEach((row, dy) => {
		row.forEach((cell, dx) => {
			if (cell) {
				const y = position.y + dy;
				const x = position.x + dx;

				if (y >= 0 && y < newGrid.length && x >= 0 && x < newGrid[0].length)
					newGrid[y][x] = {name: piece.name, option: piece.option}
			}
		});
	});
	return newGrid;
}