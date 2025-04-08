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
import { useChatContext } from "@/contexts/ChatContext";

export function ChatSidebar() {
  const {
    sessions,
    activeSessionId,
    user,
    handleNewChat,
    handleSessionClick,
    handleSignOut,
    handleSettings,
  } = useChatContext();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border px-2 py-2 h-14 justify-center">
        <div className="flex items-center justify-start">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-auto px-2"
            onClick={handleNewChat}
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
                onClick={() => handleSessionClick(session.id)}
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-0">
        <UserProfile
          {...user}
          onSignOut={handleSignOut}
          onSettings={handleSettings}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
