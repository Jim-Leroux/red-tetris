import React from "react";

export default function UsernameInput({ value, onChange }) {
	return (
		<div className="input-block">
			<label htmlFor="username">Pseudo :</label><br />
			<input id="username" type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="Entre ton pseudo" required />
		</div>
	)
}