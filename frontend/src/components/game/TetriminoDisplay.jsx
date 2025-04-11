import React from "react";
import { TETRIMINOS } from "../../logic/tetriminos";

const cellSize = 20;

export default function TetriminoDisplay() {
  return (
	<div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
	  {Object.entries(TETRIMINOS).map(([key, { shape, option }]) => (
		<div key={key}>
		  <div>{key}</div>
		  <div style={{
			display: 'grid',
			gridTemplateColumns: `repeat(${shape[0].length}, ${cellSize}px)`
		  }}>
			{shape.flat().map((cell, i) => (
			  <div key={i}
				style={{
				  width: cellSize,
				  height: cellSize,
				  backgroundColor: cell ? option.color : 'transparent',
				  boxShadow: cell ? option.boxShadow : 'transparent',
				  border: '1px solid #ddd'
				}}
			  />
			))}
		  </div>
		</div>
	  ))}
	</div>
  );
}