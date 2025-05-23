import { useRef, useEffect, createContext, useContext } from "react";
import { useAppStore } from "../store";
import { io } from "socket.io-client";
import { HOST } from "../utils/constants";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: {
          userId: userInfo.id,
        },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });

      const handleRecieveMessage = (message) => {
        const {
          selectedChatData,
          selectedChatType,
          addMessage,
          addChannelInChannelList,
        } = useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipient._id)
        ) {
          addMessage(message);
        }

        addChannelInChannelList(message);
      };

      const handleRecieveChannelMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage } =
          useAppStore.getState();

        if (
          selectedChatType != undefined &&
          selectedChatData._id === message.channelId
        ) {
          addMessage(message);
        }
        addContactsInDMContacts(message);
      };

      socket.current.on("recieveMessage", handleRecieveMessage);
      socket.current.on("recieve-channel-message", handleRecieveChannelMessage);

      return () => {
        if (socket.current) {
          socket.current.off("receiveMessage", handleRecieveMessage); // Remove listener
          socket.current.disconnect(); // Disconnect socket
        }
      };
    }
  }, [userInfo]); // Only re-run when userInfo changes

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
