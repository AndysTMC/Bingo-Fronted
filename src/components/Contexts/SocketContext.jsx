import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const ENDPOINT = "ws://10.1.180.61:3000";
const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketInstance = io(ENDPOINT, {
            autoConnect: true, 
            reconnection: true,
        });
        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            console.log('WebSocket connected');
        });

        socketInstance.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        socketInstance.on('reconnect', () => {
            console.log('WebSocket reconnected');
        });

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
