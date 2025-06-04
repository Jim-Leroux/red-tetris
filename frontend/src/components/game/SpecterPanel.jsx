import React from "react";
import { useSelector } from "react-redux";
import Specter from "./Specter";

export default function SpecterPanel() {
	const spectres = useSelector(state => state.session.spectres);

	if (!spectres || typeof spectres !== 'object') return null;

	return (
		<div className="specter-panel">
			{Object.entries(spectres).map(([playerName, specterData]) => (
				<Specter
					key={playerName}
					playerName={specterData?.username || playerName}
					specterData={specterData}
				/>
			))}
		</div>
	);
}
