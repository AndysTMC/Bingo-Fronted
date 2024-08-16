import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const ENDPOINT = "ws://10.1.187.235:3000";
const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketInstance = io(ENDPOINT);
        setSocket(socketInstance);

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
