import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UsernameInput from "../components/home/UsernameInput";
import ModeSelector from "../components/home/ModeSelector";
import RoomInput from "../components/home/RoomInput";
import StartButton from "../components/home/StartButton";
import { useDispatch } from "react-redux";
import { setIsSolo, setMe, setRoom, setIsHost, setPlayers } from "../redux/slices/sessionSlice";
import { resetGame } from "../redux/slices/gameSlice";
import { resetSolo } from "../redux/slices/soloStatsSlice";
import { resetMultiplayerStats } from "../redux/slices/multiplayerStatsSlice";
import "./home.css"
import { useSocket } from "../context/WebSocketContext";

export default function Home() {
	const socket = useSocket();
	const [username, setUsername] = useState('');
	const [mode, setMode] = useState('solo');
	const [roomName, setRoomName] = useState('');
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleStart = () => {
		if (!username.trim()) return;
		console.log('emit');
		socket?.emit('joinRoom', {username, mode, room: roomName}, (callback) => {
			const { success, isHost, room, players } = callback;
			console.log('callback', isHost	, room, players);
			if (success) {
				dispatch(setIsSolo(mode === 'solo' ? true : false));
				dispatch(setMe(username));
				dispatch(setIsHost(isHost));
				dispatch(setRoom(room));
				dispatch(resetGame());
				dispatch(mode === 'solo' ? resetSolo() : resetMultiplayerStats());
				mode === 'solo' ? null : dispatch(setPlayers(players));
				navigate(`/${room}/${username}`);
			}
		})
	};

	return (
		<div className="home-container">
			<UsernameInput value={username} onChange={setUsername} />
			<ModeSelector value={mode} onChange={setMode} />
			{mode === 'multi' && (
				<RoomInput value={roomName} onChange={setRoomName} />
			)}
			<StartButton onClick={handleStart} disabled={!username.trim()} />
		</div>
	)
}