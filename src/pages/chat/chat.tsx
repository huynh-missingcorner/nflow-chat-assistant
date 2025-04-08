import { useState } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { ChatSidebar } from "@/components/custom/chat-sidebar";
import { ChatWindow } from "@/components/custom/chat-window";
import { PreviewWindow } from "@/components/custom/preview-window";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AnimatePresence } from "framer-motion";

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
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const { messages, isLoading, sendMessage, leaveSession, joinSession } =
    useWebSocket({
      url: "http://localhost:3000",
    });

  const handleNewChat = () => {
    // Implement new chat session creation
    console.log("Create new chat");
  };

  const handleSessionClick = (sessionId: string) => {
    setActiveSessionId(sessionId);
    joinSession(sessionId);
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

  const togglePreview = () => {
    setIsPreviewOpen((prev) => !prev);
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
        <div className="flex flex-1 overflow-hidden">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSendMessage={sendMessage}
            onTogglePreview={togglePreview}
            isPreviewOpen={isPreviewOpen}
          />
          <AnimatePresence mode="wait">
            {isPreviewOpen && (
              <PreviewWindow key="preview-window" onClose={togglePreview} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </SidebarProvider>
  );
}
