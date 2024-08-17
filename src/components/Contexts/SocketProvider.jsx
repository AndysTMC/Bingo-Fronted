import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const ENDPOINT = "ws://10.1.187.235:3000";
const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Initialize the socket connection once
        const socketInstance = io(ENDPOINT, {
            autoConnect: true,  // Ensure the socket tries to connect automatically
            reconnection: true,  // Enable reconnection attempts
        });
        setSocket(socketInstance);

        // Cleanup on unmount
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
