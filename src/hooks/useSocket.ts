import { useEffect } from "react";
import { useSocketStore } from "@/stores/useSocketStore";
import { useMessageStore } from "@/stores/useMessageStore";
import { useSessionStore } from "@/stores/useSessionStore";

export function useSocket(url: string = "http://localhost:3000") {
  // Get necessary actions and state from our stores
  const {
    connect,
    disconnect,
    setupListeners,
    joinSession: joinSocketSession,
    leaveSession: leaveSocketSession,
  } = useSocketStore();

  const {
    appendChunk,
    startSocketResponse,
    finishSocketResponse,
    receiveSocketMessage,
  } = useMessageStore();

  const { activeSessionId, updateSessionTitleFromSocket } = useSessionStore();

  // Connect to WebSocket on mount
  useEffect(() => {
    connect(url);

    // Set up Socket listeners
    setupListeners(
      (data) => {
        console.log("WebSocket: messageReceived", data);
        // We don't need to call startSocketResponse here since it's already called in the UI
      },
      (data) => {
        console.log("WebSocket: messageResponse received", data);
        if (data.content) {
          // For non-streaming responses, append the entire message at once
          receiveSocketMessage(data);
          // Then mark the response as complete
          finishSocketResponse();
        }
      },
      (data) => {
        if (data.chunk) {
          // Append each chunk to the current assistant message
          appendChunk(data.chunk);
        }
      },
      () => {
        console.log("WebSocket: messageComplete");
        // Mark the streaming response as complete
        finishSocketResponse();
      },
      (data) => console.log("WebSocket: sessionJoined", data),
      (data) => {
        console.log("WebSocket: sessionTitleUpdated", data);
        updateSessionTitleFromSocket(data.sessionId, data.title);
      },
      (error) => {
        console.error("Socket error:", error);
        // Make sure to reset the UI state if there's an error
        finishSocketResponse();
      }
    );

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [
    connect,
    disconnect,
    setupListeners,
    startSocketResponse,
    finishSocketResponse,
    appendChunk,
    updateSessionTitleFromSocket,
    receiveSocketMessage,
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
