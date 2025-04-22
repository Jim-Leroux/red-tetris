import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSetting } from "../../redux/slices/gameSlice";

const SETTINGS = [
	{ label: 'Difficulté progressive', key: 'progressiveSpeed' },
	{ label: 'Gravité rapide', key: 'fastGravity' },
	{ label: 'Pièces invisibles', key: 'invisiblePieces' },
	{ label: 'Contrôles inversés', key: 'reverseControls' },
	{ label: 'Chaos mode', key: 'chaosMode' }
];

export default function SettingsPanel() {
	const dispatch = useDispatch();
	const settings = useSelector((state) => state.game.settings);

	return (
		<div>
			<h3>Paramètres de jeu</h3>
			{SETTINGS.map(({ label, key }) => (
				<label key={key} style={{ display: 'block', marginBottom: 6 }}>
					<input type="checkbox" checked={settings[key]} onChange={e => dispatch(setSetting({ name: key, value: e.target.checked })) } />
					{` ${label}`}
				</label>
			))}
		</div>
	)
}