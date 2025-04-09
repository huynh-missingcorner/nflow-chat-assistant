import { ChatSidebar } from "@/components/custom/chat-sidebar";
import { ChatWindow } from "@/components/custom/chat-window";
import { PreviewWindow } from "@/components/custom/preview-window";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useSessionStore } from "@/stores/useSessionStore";
import { useMessageStore } from "@/stores/useMessageStore";
import { useUIStore } from "@/stores/useUIStore";

export function Chat() {
  // Initialize socket connection
  useSocket();

  // Get state and actions from stores
  const { fetchSessions } = useSessionStore();
  const { fetchMessages } = useMessageStore();
  const { isPreviewOpen, togglePreview } = useUIStore();
  const activeSessionId = useSessionStore((state) => state.activeSessionId);

  // Fetch sessions on mount
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Fetch messages when activeSessionId changes
  useEffect(() => {
    if (activeSessionId) {
      fetchMessages(activeSessionId);
    }
  }, [activeSessionId, fetchMessages]);

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-dvh w-full">
        <ChatSidebar />
        <div className="flex flex-1 overflow-hidden">
          <ChatWindow />
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
