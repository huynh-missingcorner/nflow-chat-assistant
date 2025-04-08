import { createContext, ReactNode, useContext, useState } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Message } from "@/interfaces/interfaces";

interface User {
  name: string;
  email: string;
  avatarUrl: string;
}

interface Session {
  id: string;
  title: string;
  timestamp: string;
}

interface ChatContextType {
  activeSessionId: string;
  setActiveSessionId: (id: string) => void;
  isPreviewOpen: boolean;
  togglePreview: () => void;
  messages: Message[];
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
  sessions: Session[];
  user: User;
  handleNewChat: () => void;
  handleSessionClick: (sessionId: string) => void;
  handleSignOut: () => void;
  handleSettings: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Mock data - Replace with real data from your backend
const mockSessions = [
  { id: "1", title: "Chat about React", timestamp: "2h ago" },
  { id: "2", title: "TypeScript Discussion", timestamp: "5h ago" },
  { id: "3", title: "Next.js Project", timestamp: "1d ago" },
];

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
  const [activeSessionId, setActiveSessionId] = useState<string>("1");
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [sessions] = useState<Session[]>(mockSessions);
  const [user] = useState<User>(mockUser);

  const { messages, isLoading, sendMessage, joinSession, leaveSession } =
    useWebSocket({
      url: wsUrl,
    });

  function handleNewChat() {
    // Implement new chat session creation
    console.log("Create new chat");
  }

  function handleSessionClick(sessionId: string) {
    console.log("handleSessionClick", sessionId);
    leaveSession(activeSessionId);
    setActiveSessionId(sessionId);
    joinSession(sessionId);
    // Load messages for the selected session
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

  const value = {
    activeSessionId,
    setActiveSessionId,
    isPreviewOpen,
    togglePreview,
    messages,
    isLoading,
    sendMessage,
    sessions,
    user,
    handleNewChat,
    handleSessionClick,
    handleSignOut,
    handleSettings,
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
