import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { Message } from "@/interfaces/interfaces";

// Add a new interface for the title update event
interface WebSocketSessionTitleUpdatedDto {
  sessionId: string;
  title: string;
  timestamp: string;
}

interface SocketState {
  // State
  socket: Socket | null;
  isConnected: boolean;
  currentSessionId: string;

  // Actions
  connect: (url: string) => void;
  disconnect: () => void;
  joinSession: (sessionId: string) => void;
  leaveSession: (sessionId: string) => void;
  sendMessage: (message: string, sessionId: string) => void;
  setupListeners: (
    onMessageReceived: (data: Message) => void,
    onMessageResponse: (data: Message) => void,
    onMessageChunk: (data: { chunk: string }) => void,
    onMessageComplete: () => void,
    onSessionJoined: (data: { sessionId: string }) => void,
    onSessionTitleUpdated: (data: WebSocketSessionTitleUpdatedDto) => void,
    onError: (error: Error) => void
  ) => void;
}

export const useSocketStore = create<SocketState>()((set, get) => ({
  // Initial state
  socket: null,
  isConnected: false,
  currentSessionId: "",

  // Actions
  connect: (url: string) => {
    if (get().socket) return;

    const socket = io(url, {
      transports: ["websocket"],
      path: undefined, // Let Socket.IO use default path
    });

    socket.on("connect", () => {
      set({ isConnected: true });
      console.log("WebSocket connected");
    });

    socket.on("disconnect", () => {
      set({ isConnected: false, currentSessionId: "" });
      console.log("WebSocket disconnected");
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false, currentSessionId: "" });
    }
  },

  joinSession: (sessionId: string) => {
    const { socket, isConnected } = get();
    if (!socket || !isConnected) return;

    socket.emit("joinSession", {
      sessionId,
    });

    set({ currentSessionId: sessionId });
  },

  leaveSession: (sessionId: string) => {
    const { socket, isConnected, currentSessionId } = get();
    if (!socket || !isConnected || currentSessionId !== sessionId) return;

    socket.emit("leaveSession", {
      sessionId,
    });

    set({ currentSessionId: "" });
  },

  sendMessage: (message: string, sessionId: string) => {
    const { socket, isConnected } = get();
    if (!socket || !isConnected) return;

    socket.emit("sendMessage", {
      message,
      sessionId,
    });
  },

  setupListeners: (
    onMessageReceived,
    onMessageResponse,
    onMessageChunk,
    onMessageComplete,
    onSessionJoined,
    onSessionTitleUpdated,
    onError
  ) => {
    const { socket } = get();
    if (!socket) return;

    // Remove any existing listeners
    socket.off("messageReceived");
    socket.off("messageResponse");
    socket.off("messageChunk");
    socket.off("messageComplete");
    socket.off("sessionJoined");
    socket.off("sessionTitleUpdated");
    socket.off("error");

    // Set up new listeners
    socket.on("messageReceived", onMessageReceived);
    socket.on("messageResponse", onMessageResponse);
    socket.on("messageChunk", onMessageChunk);
    socket.on("messageComplete", onMessageComplete);
    socket.on("sessionJoined", onSessionJoined);
    socket.on("sessionTitleUpdated", onSessionTitleUpdated);
    socket.on("error", onError);
  },
}));
