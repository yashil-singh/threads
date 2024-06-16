import { userAtom } from "@/atoms/userAtom";
import { useContext, useEffect, useState, ReactNode, FC } from "react";
import { useRecoilValue } from "recoil";
import { createContext } from "react";
import io, { Socket } from "socket.io-client";

interface ISocketContext {
  socket: Socket | null;
  onlineUsers: string[];
}

const SocketContext = createContext<ISocketContext | undefined>(undefined);

export const useSocket = (): ISocketContext => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketContextProvider");
  }
  return context;
};

interface SocketContextProviderProps {
  children: ReactNode;
}

export const SocketContextProvider: FC<SocketContextProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    const newSocket = io("http://localhost:4000", {
      query: {
        userId: user?._id,
      },
    });

    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
