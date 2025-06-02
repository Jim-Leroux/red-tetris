export default function clearCompletedLines(grid) {
	const newGrid = grid.filter(row => {
		return !(row.every(cell => cell === 1));
	});

	const linesCleared = 20 - newGrid.length;

	while (newGrid.length < 20) {
		newGrid.unshift(Array(10).fill(0));
	}
	return {grid: newGrid, linesCleared};
}