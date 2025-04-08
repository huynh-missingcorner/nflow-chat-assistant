import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface PreviewWindowProps {
  onClose: () => void;
  defaultUrl?: string;
}

export function PreviewWindow({
  onClose,
  defaultUrl = "about:blank",
}: PreviewWindowProps) {
  const [url, setUrl] = useState<string>(defaultUrl);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUrlSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    // Add validation and URL processing here if needed
    setIsLoading(false);
  }, []);

  return (
    <motion.div
      initial={{ flex: 0, opacity: 0 }}
      animate={{ flex: 1, opacity: 1 }}
      exit={{ flex: 0, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="flex h-full min-w-0 flex-col border-l border-border bg-background"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.1 }}
        className="flex h-14 items-center gap-2 border-b border-border px-4"
      >
        <form onSubmit={handleUrlSubmit} className="flex-1">
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to preview"
            className="h-8 bg-muted"
          />
        </form>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onClose}
        >
          <X className="size-4" />
          <span className="sr-only">Close Preview</span>
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.2 }}
        className="relative flex-1"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        <iframe
          src={url}
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms"
          title="Preview"
        />
      </motion.div>
    </motion.div>
  );
}
