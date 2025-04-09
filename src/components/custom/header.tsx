import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSessionStore } from "@/stores/useSessionStore";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const { activeSessionId, sessions } = useSessionStore();
  const [titleChanged, setTitleChanged] = useState(false);

  // Find the active session to display its title
  const activeSession = sessions.find(
    (session) => session.id === activeSessionId
  );
  const sessionTitle = activeSession?.title || "Chat";

  // Add effect to detect title changes for animation
  useEffect(() => {
    setTitleChanged(true);
    const timeout = setTimeout(() => {
      setTitleChanged(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [sessionTitle]);

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
        </div>

        <AnimatePresence mode="wait">
          <motion.h1
            key={sessionTitle}
            initial={{ opacity: 0.8 }}
            animate={{
              opacity: 1,
              backgroundColor: titleChanged
                ? "rgba(107, 107, 107, 0.2)"
                : "transparent",
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-lg font-semibold truncate max-w-[200px] md:max-w-md px-2 py-1 rounded-md"
          >
            {sessionTitle}
          </motion.h1>
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
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
