import { create } from "zustand";
import { Message } from "@/interfaces/interfaces";
import {
  createChatMessage,
  getChatMessages,
  deleteChatMessage,
  updateChatMessage,
  deleteAllSessionMessages,
  mapToAppMessage,
} from "@/services/chatMessageService";
import { toast } from "sonner";
import { useSessionStore } from "./useSessionStore";
import { useUIStore } from "./useUIStore";
import { sendChatMessage } from "@/services/chatService";

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

  // Actions
  fetchMessages: (sessionId?: string) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  sendUserMessage: (
    sessionId: string,
    content: string,
    role?: "USER" | "ASSISTANT" | "SYSTEM"
  ) => Promise<Message>;
  updateMessage: (id: string, content: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  clearSessionMessages: (sessionId: string) => Promise<void>;
  receiveSocketMessage: (message: Message) => void;
  appendChunk: (chunk: string) => void;
  clearDetectedUrl: () => void;
}

export const useMessageStore = create<MessageState>()((set, get) => ({
  // Initial state
  messages: [],
  isLoading: false,
  isAiResponding: false,
  error: null,
  detectedUrl: null,

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

  sendMessage: async (text: string) => {
    const activeSessionId = useSessionStore.getState().activeSessionId;
    if (!activeSessionId || !text.trim()) return;

    try {
      // First, send the user message to the backend
      await get().sendUserMessage(activeSessionId, text);

      // Then, request a response from the AI
      set({ isAiResponding: true });

      // Call the chat API to get AI response
      const response = await sendChatMessage({
        sessionId: activeSessionId,
        message: text,
      });

      // Create an assistant message with the response
      await get().sendUserMessage(activeSessionId, response.reply, "ASSISTANT");

      // Check if the response contains URLs
      const urls = extractUrls(response.reply);
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
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Error sending message:", error);
    } finally {
      set({ isAiResponding: false });
    }
  },

  sendUserMessage: async (
    sessionId: string,
    content: string,
    role: "USER" | "ASSISTANT" | "SYSTEM" = "USER"
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createChatMessage({
        sessionId,
        content,
        role,
      });

      const newMessage = mapToAppMessage(response);

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));

      return newMessage;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to send message");
      set({ error });
      throw error;
    } finally {
      set({ isLoading: false });
    }
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
    }));

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

  appendChunk: (chunk: string) => {
    set((state) => {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];

      if (lastMessage?.role === "assistant") {
        const updatedContent = lastMessage.content + chunk;
        const updatedMessage = {
          ...lastMessage,
          content: updatedContent,
        };

        // Check for URLs in the updated content
        const updatedWithChunk = [...messages.slice(0, -1), updatedMessage];

        // Only check for URLs if we haven't already detected one
        if (!state.detectedUrl) {
          const urls = extractUrls(updatedContent);
          if (urls.length > 0) {
            // Update UI store to show preview and hide sidebar
            const uiStore = useUIStore.getState();
            uiStore.setPreviewOpen(true);
            uiStore.setSidebarOpen(false);

            // Set URL and return updated state
            setTimeout(() => {
              toast.info("URL detected and opened in preview");
            }, 100);

            return {
              messages: updatedWithChunk,
              detectedUrl: urls[0],
            };
          }
        }

        return {
          messages: updatedWithChunk,
        };
      } else {
        const newMessage = {
          id: crypto.randomUUID(),
          content: chunk,
          role: "assistant",
        } as Message;

        return {
          messages: [...messages, newMessage],
        };
      }
    });
  },

  clearDetectedUrl: () => {
    set({ detectedUrl: null });
  },
}));
