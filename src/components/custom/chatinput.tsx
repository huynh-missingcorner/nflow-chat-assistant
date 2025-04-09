import { Textarea } from "../ui/textarea";
import { cx } from "classix";
import { Button } from "../ui/button";
import { ArrowUpIcon } from "./icons";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Pause } from "lucide-react";

interface ChatInputProps {
  question: string;
  setQuestion: (question: string) => void;
  onSubmit: (text?: string) => void;
  isLoading: boolean;
  isNewChat?: boolean;
}

const suggestedActions = [
  {
    title: "Build a HR application",
    label: "Build new application",
    action: "Build a HR application",
  },
  {
    title: "Build a CRM application",
    label: "Build new application",
    action: "Build a CRM application",
  },
];

export const ChatInput = ({
  question,
  setQuestion,
  onSubmit,
  isLoading,
  isNewChat = false,
}: ChatInputProps) => {
  const [showSuggestions, setShowSuggestions] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wasLoadingRef = useRef(isLoading);

  // Watch for isLoading changes to detect when AI has finished responding
  useEffect(() => {
    // If AI was loading but now finished, focus the input
    if (wasLoadingRef.current && !isLoading) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
    // Update the ref for the next check
    wasLoadingRef.current = isLoading;
  }, [isLoading]);

  return (
    <div className="relative w-full flex flex-col gap-4">
      {showSuggestions && isNewChat && (
        <div className="hidden md:grid sm:grid-cols-2 gap-2 w-full">
          {suggestedActions.map((suggestedAction, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.05 * index }}
              key={index}
              className={index > 1 ? "hidden sm:block" : "block"}
            >
              <Button
                variant="ghost"
                onClick={() => {
                  const text = suggestedAction.action;
                  onSubmit(text);
                  setQuestion(""); // Clear the input after submission
                  setShowSuggestions(false);
                }}
                className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
              >
                <span className="font-medium">{suggestedAction.title}</span>
                <span className="text-muted-foreground">
                  {suggestedAction.label}
                </span>
              </Button>
            </motion.div>
          ))}
        </div>
      )}
      <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        multiple
        tabIndex={-1}
      />

      <Textarea
        ref={textareaRef}
        placeholder="Send a message..."
        className={cx(
          "min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-xl text-base bg-muted"
        )}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        disabled={isLoading}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();

            if (isLoading) {
              toast.error("Please wait for the model to finish its response!");
            } else {
              setShowSuggestions(false);
              onSubmit(question);
              setQuestion(""); // Clear the input after submission
            }
          }
        }}
        rows={3}
        autoFocus
      />

      <Button
        className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 border dark:border-zinc-600"
        onClick={() => {
          onSubmit(question);
          setQuestion(""); // Clear the input after submission
        }}
        disabled={question.length === 0 || isLoading}
      >
        {isLoading ? <Pause size={14} /> : <ArrowUpIcon size={14} />}
      </Button>
    </div>
  );
};
