import { ChatInput } from "./chatinput";
import { PreviewMessage, ThinkingMessage } from "./message";
import { Overview } from "./overview";
import { Header } from "./header";
import { useScrollToBottom } from "./use-scroll-to-bottom";
import { Message } from "@/interfaces/interfaces";
import { useState } from "react";
import { motion } from "framer-motion";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => Promise<void>;
  onTogglePreview?: () => void;
  isPreviewOpen?: boolean;
}

export function ChatWindow({
  messages,
  isLoading,
  onSendMessage,
  onTogglePreview,
  isPreviewOpen,
}: ChatWindowProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();
  const [question, setQuestion] = useState<string>("");

  const handleSubmit = async (text?: string) => {
    const messageText = text || question;
    await onSendMessage(messageText);
    setQuestion("");
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
      <Header onTogglePreview={onTogglePreview} isPreviewOpen={isPreviewOpen} />
      <div
        className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
        ref={messagesContainerRef}
      >
        {messages.length === 0 && <Overview />}
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
    </motion.div>
  );
}
