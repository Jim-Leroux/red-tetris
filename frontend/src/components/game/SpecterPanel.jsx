import React from "react";
import { useSelector } from "react-redux";
import Specter from "./Specter";

export default function SpecterPanel() {
	const spectres = useSelector(state => state.session.spectres);

	return (
		<div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 }}>
			{Object.entries(spectres)
				.map(([playerName, specterData]) => (
					<Specter key={playerName} playerName={specterData.username} specterData={specterData} />
			))}
		</div>
	);
}
