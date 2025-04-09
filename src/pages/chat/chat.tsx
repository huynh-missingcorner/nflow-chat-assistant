import { ChatSidebar } from "@/components/custom/chat-sidebar";
import { ChatWindow } from "@/components/custom/chat-window";
import { PreviewWindow } from "@/components/custom/preview-window";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatProvider } from "@/contexts/ChatContext";
import { AnimatePresence } from "framer-motion";
import { useChatContext } from "@/contexts/ChatContext";

export function Chat() {
  return (
    <ChatProvider>
      <SidebarProvider defaultOpen>
        <div className="flex h-dvh w-full">
          <ChatSidebar />
          <div className="flex flex-1 overflow-hidden">
            <ChatWindow />
            <AnimatePresence mode="wait">
              <PreviewWindowContainer />
            </AnimatePresence>
          </div>
        </div>
      </SidebarProvider>
    </ChatProvider>
  );
}

function PreviewWindowContainer() {
  // This component handles the conditional rendering of PreviewWindow
  // based on the isPreviewOpen state from context
  const { isPreviewOpen, togglePreview } = useChatContext();

  if (!isPreviewOpen) return null;

  return <PreviewWindow key="preview-window" onClose={togglePreview} />;
}
