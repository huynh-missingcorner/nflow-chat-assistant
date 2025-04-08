import { ChatInput } from "@/components/custom/chatinput";
import {
  PreviewMessage,
  ThinkingMessage,
} from "../../components/custom/message";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";
import { useState } from "react";
import { Overview } from "@/components/custom/overview";
import { Header } from "@/components/custom/header";
import { useWebSocket } from "@/hooks/useWebSocket";
import { ChatSessionItem } from "@/components/custom/chat-session-item";
import { UserProfile } from "@/components/custom/user-profile";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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

const WEBSOCKET_URL = "ws://localhost:8090"; // Move to environment variable in production

export function Chat() {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();
  const [question, setQuestion] = useState<string>("");
  const [activeSessionId, setActiveSessionId] = useState<string>("1");

  const { messages, isLoading, sendMessage } = useWebSocket({
    url: WEBSOCKET_URL,
  });

  async function handleSubmit(text?: string) {
    const messageText = text || question;
    await sendMessage(messageText);
    setQuestion("");
  }

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
      <div className="flex h-dvh">
        <Sidebar>
          <SidebarHeader className="border-b border-border px-2 py-2">
            <div className="flex items-center justify-between">
              <SidebarTrigger />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleNewChat}
              >
                <Plus className="size-4" />
                <span className="sr-only">New Chat</span>
              </Button>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {mockSessions.map((session) => (
                <SidebarMenuItem key={session.id}>
                  <ChatSessionItem
                    {...session}
                    isActive={session.id === activeSessionId}
                    onClick={() => handleSessionClick(session.id)}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-border p-0">
            <UserProfile
              {...mockUser}
              onSignOut={handleSignOut}
              onSettings={handleSettings}
            />
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-1 flex-col bg-background">
          <Header />
          <div
            className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
            ref={messagesContainerRef}
          >
            {messages.length == 0 && <Overview />}
            {messages.map((message, index) => (
              <PreviewMessage key={index} message={message} />
            ))}
            {isLoading && <ThinkingMessage />}
            <div
              ref={messagesEndRef}
              className="shrink-0 min-w-[24px] min-h-[24px]"
            />
          </div>
          <div className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
            <ChatInput
              question={question}
              setQuestion={setQuestion}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
