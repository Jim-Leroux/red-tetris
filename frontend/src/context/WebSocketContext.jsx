import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const WebSocketContext = createContext(undefined);

export default function WebSocketProvider({ children }) {
	const [socket, setSocket] = useState(undefined)

	useEffect(() => {
		const socketIOClient = io(`http://paul-f4ar4s4.clusters.42paris.fr:3000`);
		socketIOClient.on('connect', () => {
			setSocket(socketIOClient);
		})
		return () => {
			socketIOClient.off('connect');
			socketIOClient.disconnect()
		}
	}, []);
	const value = useMemo(() => socket, [socket]);
	return (
		<WebSocketContext.Provider value={value}>
			{children}
		</WebSocketContext.Provider>
	)
}

export const useSocket = () => useContext(WebSocketContext);
