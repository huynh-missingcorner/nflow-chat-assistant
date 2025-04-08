import { useEffect, useRef, useState } from "react";
import { Message } from "@/interfaces/interfaces";
import { v4 as uuidv4 } from "uuid";
import { io, Socket } from "socket.io-client";

interface UseWebSocketProps {
  url: string;
}

interface UseWebSocketReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
  isConnected: boolean;
}

export function useWebSocket({ url }: UseWebSocketProps): UseWebSocketReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);
  const currentSessionId = useRef<string>("");

  // Initialize socket connection
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(url, {
        transports: ["websocket"],
        path: undefined, // Let Socket.IO use default path
      });

      // Set up event listeners
      socketRef.current.on("connect", () => {
        setIsConnected(true);
        addSystemMessage("Connected to server");
      });

      socketRef.current.on("disconnect", () => {
        setIsConnected(false);
        addSystemMessage("Disconnected from server");
        currentSessionId.current = "";
      });

      socketRef.current.on("messageReceived", (data) => {
        addSystemMessage(`Message received (ID: ${data.messageId})`);
      });

      socketRef.current.on("messageResponse", (data) => {
        addAssistantMessage(data.message);
      });

      socketRef.current.on("messageChunk", (data) => {
        // For streaming responses
        appendToLastMessage(data.chunk);
      });

      socketRef.current.on("messageComplete", () => {
        setIsLoading(false);
      });

      socketRef.current.on("sessionJoined", (data) => {
        addSystemMessage(`Joined session: ${data.sessionId}`);
        currentSessionId.current = data.sessionId;
        setIsConnected(true);
      });

      socketRef.current.on("error", (error) => {
        addSystemMessage(`Error: ${error.message}`);
        console.error("Socket error:", error);
        setIsLoading(false);
      });
    }

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [url]);

  // Helper to add system messages
  const addSystemMessage = (content: string) => {
    setMessages((prev) => [...prev, { content, role: "system", id: uuidv4() }]);
  };

  // Helper to add assistant messages
  const addAssistantMessage = (content: string) => {
    const messageId = uuidv4();
    setMessages((prev) => [
      ...prev,
      { content, role: "assistant", id: messageId },
    ]);
  };

  // Helper to append chunks to the last assistant message
  const appendToLastMessage = (chunk: string) => {
    setMessages((prev) => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage?.role === "assistant") {
        const updatedMessage = {
          ...lastMessage,
          content: lastMessage.content + chunk,
        };
        return [...prev.slice(0, -1), updatedMessage];
      } else {
        // If last message is not from assistant, create a new one
        return [...prev, { content: chunk, role: "assistant", id: uuidv4() }];
      }
    });
  };

  const sendMessage = async (text: string) => {
    if (!socketRef.current || !isConnected || isLoading) return;

    setIsLoading(true);
    const messageId = uuidv4();

    // Add user message to the messages array
    setMessages((prev) => [
      ...prev,
      { content: text, role: "user", id: messageId },
    ]);

    // Send the message to the server
    socketRef.current.emit("sendMessage", {
      message: text,
      messageId,
      sessionId: currentSessionId.current,
    });
  };

  return {
    messages,
    isLoading,
    sendMessage,
    isConnected,
  };
}
