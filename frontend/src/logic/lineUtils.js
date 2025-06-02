export default function clearCompletedLines(grid) {
	const newGrid = grid.filter(row => {
		return row.some(cell => cell === 0 || cell === 9);
	});

	const linesCleared = grid.length - newGrid.length;

	while (newGrid.length < 20) {
		newGrid.unshift(Array(10).fill(0));
	}

	return { grid: newGrid, linesCleared };
}
