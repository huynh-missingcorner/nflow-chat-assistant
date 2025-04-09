import { useEffect } from "react";
import { useSocketStore } from "@/stores/useSocketStore";
import { useMessageStore } from "@/stores/useMessageStore";
import { useSessionStore } from "@/stores/useSessionStore";
import { v4 as uuidv4 } from "uuid";

export function useSocket(url: string = "http://localhost:3000") {
  // Get necessary actions and state from our stores
  const {
    connect,
    disconnect,
    setupListeners,
    joinSession: joinSocketSession,
    leaveSession: leaveSocketSession,
  } = useSocketStore();

  const { receiveSocketMessage, appendChunk } = useMessageStore();
  const { activeSessionId } = useSessionStore();

  // Connect to WebSocket on mount
  useEffect(() => {
    connect(url);

    // Set up Socket listeners
    setupListeners(
      (data) => console.log("WebSocket: messageReceived", data),
      (data) => {
        // Handle complete message response
        receiveSocketMessage({
          id: uuidv4(),
          content: data.message,
          role: "assistant",
        });
      },
      (data) => {
        // Handle streaming response chunks
        appendChunk(data.chunk);
      },
      () => console.log("WebSocket: messageComplete"),
      (data) => console.log("WebSocket: sessionJoined", data),
      (error) => console.error("Socket error:", error)
    );

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [
    connect,
    disconnect,
    setupListeners,
    receiveSocketMessage,
    appendChunk,
    url,
  ]);

  // Join session when activeSessionId changes
  useEffect(() => {
    if (activeSessionId) {
      joinSocketSession(activeSessionId);
    }

    return () => {
      if (activeSessionId) {
        leaveSocketSession(activeSessionId);
      }
    };
  }, [activeSessionId, joinSocketSession, leaveSocketSession]);

  return null;
}
