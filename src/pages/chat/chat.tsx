import { useState } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { ChatSidebar } from "@/components/custom/chat-sidebar";
import { ChatWindow } from "@/components/custom/chat-window";
import { SidebarProvider } from "@/components/ui/sidebar";

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

export function Chat() {
  const [activeSessionId, setActiveSessionId] = useState<string>("1");

  const { messages, isLoading, sendMessage } = useWebSocket({
    url: "ws://localhost:8090",
  });

  const handleNewChat = () => {
    // Implement new chat session creation
    console.log("Create new chat");
  };

  const handleSessionClick = (sessionId: string) => {
    setActiveSessionId(sessionId);
    // Load messages for the selected session
  };

  const handleSignOut = () => {
    // Implement sign out logic
    console.log("Sign out");
  };

  const handleSettings = () => {
    // Implement settings navigation
    console.log("Open settings");
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-dvh w-full">
        <ChatSidebar
          sessions={mockSessions}
          activeSessionId={activeSessionId}
          user={mockUser}
          onNewChat={handleNewChat}
          onSessionSelect={handleSessionClick}
          onSignOut={handleSignOut}
          onSettings={handleSettings}
        />
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
        />
      </div>
    </SidebarProvider>
  );
}
