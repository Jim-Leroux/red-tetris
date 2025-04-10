import React from "react";

export default function ModeSelector({ value, onChange }) {
	return (
		<div className="mode-selector">
			<p>Mode de jeu</p>
			<div className="mode-options">
				<label className={value === 'solo' ? 'selected' : ''}>
					<input type="radio" value="solo" checked={value === 'solo'} onChange={() => onChange('solo')} />
					Solo
				</label>
				<label className={value === 'multi' ? 'selected' : ''}>
					<input type="radio" value="multi" checked={value === 'multi'} onChange={() => onChange('multi')} />
					Multijoueur
				</label>
			</div>
		</div>
	)
}