import React from "react";

export default function Specter({ playerName, specterData }) {
	return (
		<div style={{ margin: 10 }}>
			<p style={{ fontWeight: 'bold' }}>{playerName}</p>
			<div style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(10, 10px)',
				gap: '1px'
			}}>
				{specterData.map((height, x) => {
					return Array.from({ length: 20 }).map((_, y) => {
						const filled = y >= height;
						return (
							<div
								key={`${x}-${y}`}
								style={{
									width: 10,
									height: 10,
									backgroundColor: filled ? 'gray' : 'transparent',
									border: '1px solid #444'
								}}
							/>
						);
					});
				})}
			</div>
		</div>
	)
}