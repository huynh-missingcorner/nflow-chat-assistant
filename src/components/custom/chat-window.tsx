import { ChatInput } from "./chatinput";
import { PreviewMessage, ThinkingMessage } from "./message";
import { Overview } from "./overview";
import { Header } from "./header";
import { useScrollToBottom } from "./use-scroll-to-bottom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Trash, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useMessageStore } from "@/stores/useMessageStore";
import { useSessionStore } from "@/stores/useSessionStore";
import { useUIStore } from "@/stores/useUIStore";

export function ChatWindow() {
  // Get state and actions from stores
  const {
    messages,
    isAiResponding,
    sendMessage,
    deleteMessage,
    clearSessionMessages,
    detectedUrl,
  } = useMessageStore();
  const { activeSessionId } = useSessionStore();
  const { isPreviewOpen, togglePreview, setPreviewOpen } = useUIStore();

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();
  const [question, setQuestion] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);

  // Auto-open preview when a URL is detected
  useEffect(() => {
    if (detectedUrl && !isPreviewOpen) {
      setPreviewOpen(true);
    }
  }, [detectedUrl, isPreviewOpen, setPreviewOpen]);

  const isNewChat = messages.length === 0;

  const handleSubmit = async (text?: string) => {
    const messageText = text || question;
    if (!messageText.trim()) return;

    await sendMessage(messageText);
    setQuestion("");
  };

  const handleMessageDelete = async (id: string) => {
    setSelectedMessageId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteMessage = async () => {
    if (selectedMessageId) {
      await deleteMessage(selectedMessageId);
      setIsDeleteDialogOpen(false);
      setSelectedMessageId(null);
    }
  };

  const handleClearAllMessages = () => {
    setIsDeleteAllDialogOpen(true);
  };

  const confirmClearAllMessages = async () => {
    if (activeSessionId) {
      await clearSessionMessages(activeSessionId);
      setIsDeleteAllDialogOpen(false);
    }
  };

  return (
    <motion.div
      animate={{ flex: isPreviewOpen ? 1 : 2 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="flex min-w-0 flex-1 flex-col bg-background"
    >
      <Header
        onTogglePreview={togglePreview}
        isPreviewOpen={isPreviewOpen}
        showClearMessages={messages.length > 0}
        onClearMessages={handleClearAllMessages}
      />
      <div
        className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
        ref={messagesContainerRef}
      >
        {isNewChat && <Overview />}
        {messages.map((message, index) => (
          <div key={message.id || index} className="group relative">
            <PreviewMessage message={message} />
            {message.role === "user" && (
              <div className="absolute right-4 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleMessageDelete(message.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        ))}
        {isAiResponding && <ThinkingMessage />}
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
          isLoading={isAiResponding}
          isNewChat={isNewChat}
        />
      </div>

      {/* Delete Message Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
          </DialogHeader>
          <p className="py-4">Are you sure you want to delete this message?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteMessage}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear All Messages Dialog */}
      <Dialog
        open={isDeleteAllDialogOpen}
        onOpenChange={setIsDeleteAllDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All Messages</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to clear all messages in this chat? This
            action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteAllDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmClearAllMessages}>
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
