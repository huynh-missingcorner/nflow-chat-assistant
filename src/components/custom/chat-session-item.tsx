import { MessageSquare } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";

interface ChatSessionItemProps {
  id: string;
  title: string;
  isActive?: boolean;
  onClick: () => void;
  timestamp: string;
}

export function ChatSessionItem({
  title,
  isActive,
  onClick,
  timestamp,
}: ChatSessionItemProps) {
  return (
    <SidebarMenuButton
      isActive={isActive}
      onClick={onClick}
      tooltip={title}
      className="w-full justify-start h-10"
    >
      <MessageSquare className="shrink-0" />
      <span className="flex-1 truncate">{title}</span>
      <span className="text-xs text-muted-foreground">{timestamp}</span>
    </SidebarMenuButton>
  );
}
