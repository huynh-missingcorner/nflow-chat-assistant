import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import { ChatSessionItem } from "./chat-session-item";
import { UserProfile } from "./user-profile";

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  onNewChat: () => void;
  onSessionSelect: (sessionId: string) => void;
  onSignOut: () => void;
  onSettings: () => void;
}

export function ChatSidebar({
  sessions,
  activeSessionId,
  user,
  onNewChat,
  onSessionSelect,
  onSignOut,
  onSettings,
}: ChatSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border px-2 py-2 h-14 justify-center">
        <div className="flex items-center justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-auto px-2"
            onClick={onNewChat}
          >
            <Plus className="size-4" />
            <span>New Chat</span>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {sessions.map((session) => (
            <SidebarMenuItem key={session.id}>
              <ChatSessionItem
                {...session}
                isActive={session.id === activeSessionId}
                onClick={() => onSessionSelect(session.id)}
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-0">
        <UserProfile {...user} onSignOut={onSignOut} onSettings={onSettings} />
      </SidebarFooter>
    </Sidebar>
  );
}
