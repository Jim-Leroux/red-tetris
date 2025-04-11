import React from "react";

export default function RoomInput({ value, onChange, disabled }) {
	return (
		<div className="input-block">
			<label htmlFor="room">Nom de la room :</label><br />
			<input id="room" type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="Laisse vide pour créer une nouvelle room" disabled={disabled}/>
		</div>
	)
}