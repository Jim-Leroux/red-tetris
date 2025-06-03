import { useSelector } from "react-redux";
import { TETRIMINOS } from "../../logic/tetriminos";

function getCellColor(cell) {
	if (!cell) return 'transparent';
	if (typeof cell === 'object') {
		const piece = TETRIMINOS[cell.name];
		return piece?.option?.color || 'gray';
	}
	if (cell === 9) return '#444';
	return 'transparent';
}

function getCellShadow(cell) {
	if (!cell || typeof cell !== 'object') return 'none';
	return TETRIMINOS[cell.name]?.option?.boxShadow || 'none';
}

export default function TetrisGrid() {
	const isSolo = useSelector((state) => state.session.isSolo);
	const clientGrid = useSelector((state) => state.game.grid);
	const serverGrid = useSelector((state) => state.session.serverGrid);
	const grid = isSolo ? clientGrid : serverGrid || clientGrid;

	const { shape, position, option } = useSelector((state) => state.game.activePiece);
	const invisible = useSelector((state) => state.game.settings.invisiblePieces);
	const tick = useSelector((state) => state.game.invisibleTick);

	const renderedGrid = grid.map((row, y) => {
		return row.map((cell, x) => {
			let isPieceCell = false;

			if (isSolo) {
				shape.forEach((rowPiece, dy) => {
					rowPiece.forEach((value, dx) => {
						if (value && y === position.y + dy && x === position.x + dx)
							isPieceCell = true;
					});
				});
			}

			const classes = ['tetris-cell'];

			if (isPieceCell) {
				classes.push('piece-cell');
				if (invisible && tick > 5) {
					classes.push('invisible');
				}
			} else if (cell) {
				classes.push('filled-cell');
			}

			const color = isPieceCell && (!invisible || tick <= 5)
				? option.color
				: cell === 9
					? '#3a3a3a'
					: getCellColor(cell);

			const shadow = isPieceCell && (!invisible || tick <= 5)
				? option.boxShadow
				: getCellShadow(cell);

			return (
				<div key={`${y}-${x}`} className={classes.join(' ')} style={{
					backgroundColor: color,
					boxShadow: shadow,
				}} />
			);
		})
	});

	return (
		<div className="tetris-grid">
			{renderedGrid.flat()}
		</div>
	);
}
