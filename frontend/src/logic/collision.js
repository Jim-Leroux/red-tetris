export function hasCollision(grid, shape, position) {
	const {x, y} = position;

	for (let dy = 0; dy < shape.length; dy++) {
		for (let dx = 0; dx < shape[dy].length; dx++) {
			if (shape[dy][dx]) {
				const newY = y + dy;
				const newX = x + dx;

				if (newY >= grid.length || newX < 0 || newX >= grid[0].length || grid[newY][newX])
					return true;
			}
		}
	}
	return false;
}