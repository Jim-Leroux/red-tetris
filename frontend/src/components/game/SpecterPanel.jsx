import React from "react";
import { useSelector } from "react-redux";
import Specter from "./Specter";

export default function SpecterPanel() {
	const spectres = useSelector(state => state.session.spectres);
	const me = useSelector(state => state.session.me);

	if (!spectres || Object.keys(spectres).length <= 1) return null;

	return (
		<div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 }}>
			{Object.entries(spectres)
				.filter(([playerName]) => playerName !== me)
				.map(([playerName, specterData]) => (
					<Specter key={playerName} playerName={playerName} specterData={specterData} />
			))}
		</div>
	);
}
