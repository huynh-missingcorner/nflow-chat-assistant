import { createContext, ReactNode, useContext, useState } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Message } from "@/interfaces/interfaces";
import { useChatSessions } from "@/hooks/useChatSessions";
import { Session } from "@/types/chat";
import { toast } from "sonner";

interface User {
  name: string;
  email: string;
  avatarUrl: string;
}

interface ChatContextType {
  activeSessionId: string;
  setActiveSessionId: (id: string) => void;
  isPreviewOpen: boolean;
  togglePreview: () => void;
  messages: Message[];
  isLoading: boolean;
  isSessionsLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
  sessions: Session[];
  user: User;
  handleNewChat: () => void;
  handleSessionClick: (sessionId: string) => void;
  handleSignOut: () => void;
  handleSettings: () => void;
  updateSessionTitle: (id: string, title: string) => Promise<void>;
  archiveSession: (id: string) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Mock user data - Replace with real data from your auth system
const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  avatarUrl: "", // Add avatar URL if available
};

interface ChatProviderProps {
  children: ReactNode;
  wsUrl: string;
}

export function ChatProvider({ children, wsUrl }: ChatProviderProps) {
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [user] = useState<User>(mockUser);

  const {
    sessions,
    isLoading: isSessionsLoading,
    createSession,
    updateSession,
    deleteSession: removeSession,
  } = useChatSessions();

  const { messages, isLoading, sendMessage, joinSession, leaveSession } =
    useWebSocket({
      url: wsUrl,
    });

  async function handleNewChat() {
    try {
      const newSession = await createSession("New Chat");
      setActiveSessionId(newSession.id);
      joinSession(newSession.id);
      toast.success("New chat created");
    } catch (error) {
      toast.error("Failed to create new chat");
      console.error("Error creating new chat:", error);
    }
  }

  function handleSessionClick(sessionId: string) {
    if (activeSessionId) {
      leaveSession(activeSessionId);
    }
    setActiveSessionId(sessionId);
    joinSession(sessionId);
  }

  function handleSignOut() {
    // Implement sign out logic
    console.log("Sign out");
  }

  function handleSettings() {
    // Implement settings navigation
    console.log("Open settings");
  }

  function togglePreview() {
    setIsPreviewOpen((prev) => !prev);
  }

  async function updateSessionTitle(id: string, title: string) {
    try {
      await updateSession(id, { title });
      toast.success("Session updated");
    } catch (error) {
      toast.error("Failed to update session");
      console.error("Error updating session:", error);
    }
  }

  async function archiveSession(id: string) {
    try {
      await updateSession(id, { archived: true });
      toast.success("Session archived");

      // If we archived the active session, select another one
      if (id === activeSessionId && sessions.length > 1) {
        const nextSession = sessions.find(
          (session) => session.id !== id && !session.archived
        );
        if (nextSession) {
          handleSessionClick(nextSession.id);
        }
      }
    } catch (error) {
      toast.error("Failed to archive session");
      console.error("Error archiving session:", error);
    }
  }

  async function deleteSession(id: string) {
    try {
      await removeSession(id);
      toast.success("Session deleted");

      // If we deleted the active session, select another one
      if (id === activeSessionId && sessions.length > 1) {
        const nextSession = sessions.find((session) => session.id !== id);
        if (nextSession) {
          handleSessionClick(nextSession.id);
        }
      }
    } catch (error) {
      toast.error("Failed to delete session");
      console.error("Error deleting session:", error);
    }
  }

  // Set initial active session if none is selected and sessions are loaded
  if (!activeSessionId && sessions.length > 0 && !isSessionsLoading) {
    setActiveSessionId(sessions[0].id);
    joinSession(sessions[0].id);
  }

  const value = {
    activeSessionId,
    setActiveSessionId,
    isPreviewOpen,
    togglePreview,
    messages,
    isLoading,
    isSessionsLoading,
    sendMessage,
    sessions,
    user,
    handleNewChat,
    handleSessionClick,
    handleSignOut,
    handleSettings,
    updateSessionTitle,
    archiveSession,
    deleteSession,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
