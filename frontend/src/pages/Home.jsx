import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UsernameInput from "../components/home/UsernameInput";
import ModeSelector from "../components/home/ModeSelector";
import RoomInput from "../components/home/RoomInput";
import StartButton from "../components/home/StartButton";
import { useDispatch } from "react-redux";
import { setIsSolo, setMe, setRoom, setIsHost } from "../redux/slices/sessionSlice";
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
		socket?.emit('joinRoom2', {username, mode, roomName}, (callback) => {
			const { isHost, room } = callback;
			console.log('callback', callback);
			if (room) {
				const test = mode === 'solo' ? true : false;
				console.log('test', test);
				dispatch(setIsSolo(test));
				dispatch(setMe(username));
				dispatch(setIsHost(isHost));
				dispatch(setRoom(room));
				dispatch(resetGame());
				dispatch(mode === 'solo' ? resetSolo() : resetMultiplayerStats());
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