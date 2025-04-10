import React from "react";

export default function StartButton({ onClick, disabled }) {
	return (
		<button onClick={onClick} disabled={disabled}>
			Lancer la partie
		</button>
	);
}