import { useRef, useState } from "react";
import { Message } from "@/interfaces/interfaces";
import { v4 as uuidv4 } from "uuid";

interface UseWebSocketProps {
  url: string;
}

interface UseWebSocketReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
}

export function useWebSocket({ url }: UseWebSocketProps): UseWebSocketReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const socket = useRef<WebSocket | null>(null);
  const messageHandlerRef = useRef<((event: MessageEvent) => void) | null>(
    null
  );

  // Initialize WebSocket connection
  if (!socket.current) {
    socket.current = new WebSocket(url);
  }

  const cleanupMessageHandler = () => {
    if (messageHandlerRef.current && socket.current) {
      socket.current.removeEventListener("message", messageHandlerRef.current);
      messageHandlerRef.current = null;
    }
  };

  const sendMessage = async (text: string) => {
    if (
      !socket.current ||
      socket.current.readyState !== WebSocket.OPEN ||
      isLoading
    )
      return;

    setIsLoading(true);
    cleanupMessageHandler();

    const traceId = uuidv4();
    setMessages((prev) => [
      ...prev,
      { content: text, role: "user", id: traceId },
    ]);
    socket.current.send(text);

    try {
      const messageHandler = (event: MessageEvent) => {
        setIsLoading(false);
        if (event.data.includes("[END]")) {
          return;
        }

        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          const newContent =
            lastMessage?.role === "assistant"
              ? lastMessage.content + event.data
              : event.data;

          const newMessage = {
            content: newContent,
            role: "assistant",
            id: traceId,
          };
          return lastMessage?.role === "assistant"
            ? [...prev.slice(0, -1), newMessage]
            : [...prev, newMessage];
        });

        if (event.data.includes("[END]")) {
          cleanupMessageHandler();
        }
      };

      messageHandlerRef.current = messageHandler;
      socket.current.addEventListener("message", messageHandler);
    } catch (error) {
      console.error("WebSocket error:", error);
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
  };
}
