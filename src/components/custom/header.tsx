import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useChatContext } from "@/contexts/ChatContext";

interface HeaderProps {
  onTogglePreview?: () => void;
  isPreviewOpen?: boolean;
  showClearMessages?: boolean;
  onClearMessages?: () => void;
}

export function Header({
  onTogglePreview,
  isPreviewOpen,
  showClearMessages,
  onClearMessages,
}: HeaderProps) {
  const { activeSessionId, sessions } = useChatContext();

  // Find the active session to display its title
  const activeSession = sessions.find(
    (session) => session.id === activeSessionId
  );
  const sessionTitle = activeSession?.title || "Chat";

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <ThemeToggle />
        </div>

        <h1 className="text-lg font-semibold truncate max-w-[200px] md:max-w-md">
          {sessionTitle}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {showClearMessages && onClearMessages && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearMessages}
            className="h-8 w-8"
            title="Clear all messages"
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
        {onTogglePreview && (
          <Button
            variant="outline"
            size="sm"
            onClick={onTogglePreview}
            className="h-8 gap-1 text-xs"
          >
            {isPreviewOpen ? "Hide Preview" : "Show Preview"}
            <ExternalLink className="h-3 w-3" />
          </Button>
        )}
      </div>
    </header>
  );
}
