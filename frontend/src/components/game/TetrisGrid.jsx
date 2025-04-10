import React from "react";
import { useSelector } from "react-redux";

export default function TetrisGrid() {
	const grid = useSelector((state) => state.game.grid);
	const { shape, position, option } = useSelector((state) => state.game.activePiece);
	const invisible = useSelector((state) => state.game.settings.invisiblePieces);
	const tick = useSelector((state) => state.game.invisibleTick);

	const renderedGrid = grid.map((row, y) =>  {
		return  row.map((cell, x) => {
			let isPieceCell = false;

			shape.forEach((rowPiece, dy) => {
				rowPiece.forEach((value, dx) => {
					if (value && y === position.y + dy && x === position.x + dx)
						isPieceCell = true;
				});
			});
			const classes = ['tetris-cell'];

			if (isPieceCell) {
				classes.push('piece-cell');
				if (invisible && tick > 5) {
					classes.push('invisible');
				}
			} else if (cell) {
				classes.push('filled-cell');
			}
			return (
				<div key={`${y}-${x}`} className={classes.join(' ')} style={{
					backgroundColor: isPieceCell && (!invisible || tick <= 5)
						? option.color
						: cell?.option?.color || 'transparent',
					boxShadow: isPieceCell && (!invisible || tick <= 5)
						? option.boxShadow
						: cell?.option?.boxShadow || 'none'
				}} />
			);
		})
	})
	return (
		<div className="tetris-grid">
			{renderedGrid.flat()}
		</div>
	);
}