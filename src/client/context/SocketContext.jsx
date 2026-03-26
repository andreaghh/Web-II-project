import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children, user }) => {
    const socket = useRef(null);

    useEffect(() => {
        if (user && !socket.current) {
            socket.current = io("http://localhost:3000", {
                withCredentials: true,
            });

            socket.current.emit("join", {
                userId: user.id,
                userName: user.name,
            });
        }
    }, [user]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
