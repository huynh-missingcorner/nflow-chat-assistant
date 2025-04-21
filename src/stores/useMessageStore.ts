import { create } from "zustand";
import { Message } from "@/interfaces/interfaces";
import {
  getChatMessages,
  deleteChatMessage,
  updateChatMessage,
  deleteAllSessionMessages,
  mapToAppMessage,
} from "@/services/chatMessageService";
import { toast } from "sonner";
import { useSessionStore } from "./useSessionStore";
import { useUIStore } from "./useUIStore";
import { v4 as uuidv4 } from "uuid";

// Helper function to extract URLs from text
const extractUrls = (text: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
};

interface MessageState {
  // State
  messages: Message[];
  isLoading: boolean;
  isAiResponding: boolean;
  error: Error | null;
  detectedUrl: string | null;
  streamingMessageId: string | null;

  // Actions
  fetchMessages: (sessionId?: string) => Promise<void>;
  sendUserMessage: (
    sessionId: string,
    content: string,
    role?: "USER" | "ASSISTANT" | "SYSTEM"
  ) => Promise<Message>;
  updateMessage: (id: string, content: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  clearSessionMessages: (sessionId: string) => Promise<void>;
  receiveSocketMessage: (message: Message) => void;
  startSocketResponse: () => void;
  finishSocketResponse: () => void;
  appendChunk: (chunk: string) => void;
  clearDetectedUrl: () => void;
}

export const useMessageStore = create<MessageState>()((set) => ({
  // Initial state
  messages: [],
  isLoading: false,
  isAiResponding: false,
  error: null,
  detectedUrl: null,
  streamingMessageId: null,

  // Actions
  fetchMessages: async (sessionId?: string) => {
    const targetSessionId =
      sessionId || useSessionStore.getState().activeSessionId;
    if (!targetSessionId) return;

    set({ isLoading: true, error: null });
    try {
      const data = await getChatMessages(targetSessionId);
      const appMessages = data.map(mapToAppMessage);
      set({ messages: appMessages });
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to fetch messages");
      set({ error });
      toast.error("Failed to load messages");
    } finally {
      set({ isLoading: false });
    }
  },

  sendUserMessage: async (
    sessionId: string,
    content: string,
    role: "USER" | "ASSISTANT" | "SYSTEM" = "USER"
  ) => {
    // Create an optimistic message with a temporary ID
    const tempMessage = {
      id: uuidv4(),
      content,
      role: role.toLowerCase(),
    };

    // Update the UI immediately
    set((state) => ({
      messages: [...state.messages, tempMessage],
    }));

    return tempMessage;
  },

  updateMessage: async (id: string, content: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateChatMessage(id, { content });
      const updatedMessage = mapToAppMessage(response);

      set((state) => ({
        messages: state.messages.map((message) =>
          message.id === id ? updatedMessage : message
        ),
      }));

      toast.success("Message updated");
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error(`Failed to update message ${id}`);
      set({ error });
      toast.error("Failed to update message");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteMessage: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteChatMessage(id);
      set((state) => ({
        messages: state.messages.filter((message) => message.id !== id),
      }));
      toast.success("Message deleted");
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error(`Failed to delete message ${id}`);
      set({ error });
      toast.error("Failed to delete message");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearSessionMessages: async (sessionId: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteAllSessionMessages(sessionId);
      set({ messages: [] });
      toast.success("Messages cleared");
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error(`Failed to clear messages for session ${sessionId}`);
      set({ error });
      toast.error("Failed to clear messages");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Socket actions
  receiveSocketMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message],
      isAiResponding: false,
    }));

    message.role = message.role.toLowerCase();

    // If it's an assistant message, check for URLs
    if (message.role === "assistant") {
      const urls = extractUrls(message.content);
      if (urls.length > 0) {
        // Update UI store to show preview and hide sidebar
        const uiStore = useUIStore.getState();
        uiStore.setPreviewOpen(true);
        uiStore.setSidebarOpen(false);

        // Set the first URL as the detected URL
        set({ detectedUrl: urls[0] });

        // Add a small toast notification
        toast.info("URL detected and opened in preview");
      }
    }
  },

  startSocketResponse: () => {
    set({ isAiResponding: true });
  },

  finishSocketResponse: () => {
    set({
      isAiResponding: false,
      streamingMessageId: null,
    });
  },

  appendChunk: (chunk: string) => {
    set((state) => {
      const messages = [...state.messages];
      const lastIndex = messages.length - 1;

      // Only append if we have messages and the last one is from the assistant
      if (lastIndex >= 0 && messages[lastIndex].role === "assistant") {
        const lastMessage = messages[lastIndex];
        const updatedContent = lastMessage.content + chunk;
        const updatedMessage = {
          ...lastMessage,
          content: updatedContent,
        };

        // Check for URLs in the new chunk
        const urls = extractUrls(updatedContent);
        if (urls.length > 0 && !state.detectedUrl) {
          // Update UI store to show preview and hide sidebar
          const uiStore = useUIStore.getState();
          uiStore.setPreviewOpen(true);
          uiStore.setSidebarOpen(false);

          // Set the first URL as the detected URL
          state.detectedUrl = urls[0];

          // Add a small toast notification
          toast.info("URL detected and opened in preview");
        }

        // Return updated state
        return {
          ...state,
          messages: [...messages.slice(0, lastIndex), updatedMessage],
        };
      }

      return state;
    });
  },

  clearDetectedUrl: () => {
    set({ detectedUrl: null });
  },
}));
