import { useCallback, useEffect, useState } from "react";
import { Message } from "@/interfaces/interfaces";
import {
  createChatMessage,
  getChatMessages,
  deleteChatMessage,
  updateChatMessage,
  deleteAllSessionMessages,
  mapToAppMessage,
} from "@/services/chatMessageService";

interface UseChatMessagesReturn {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  fetchMessages: (sessionId?: string) => Promise<Message[]>;
  sendMessage: (
    sessionId: string,
    content: string,
    role?: "USER" | "ASSISTANT" | "SYSTEM"
  ) => Promise<Message>;
  updateMessage: (id: string, content: string) => Promise<Message>;
  deleteMessage: (id: string) => Promise<void>;
  clearSessionMessages: (sessionId: string) => Promise<void>;
  setActiveSessionId: (sessionId: string) => void;
}

export function useChatMessages(initialSessionId = ""): UseChatMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeSessionId, setActiveSessionId] =
    useState<string>(initialSessionId);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMessages = useCallback(
    async (sessionId?: string): Promise<Message[]> => {
      const targetSessionId = sessionId || activeSessionId;
      if (!targetSessionId) return [];

      setIsLoading(true);
      setError(null);
      try {
        const data = await getChatMessages(targetSessionId);
        const appMessages = data.map(mapToAppMessage);

        if (
          sessionId === activeSessionId ||
          (!sessionId && targetSessionId === activeSessionId)
        ) {
          setMessages(appMessages);
        }

        return appMessages;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to fetch messages");
        setError(error);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [activeSessionId]
  );

  const sendMessage = useCallback(
    async (
      sessionId: string,
      content: string,
      role: "USER" | "ASSISTANT" | "SYSTEM" = "USER"
    ): Promise<Message> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await createChatMessage({
          sessionId,
          content,
          role,
        });

        const newMessage = mapToAppMessage(response);

        if (sessionId === activeSessionId) {
          setMessages((prev) => [...prev, newMessage]);
        }

        return newMessage;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to send message");
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [activeSessionId]
  );

  const updateMessage = useCallback(
    async (id: string, content: string): Promise<Message> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await updateChatMessage(id, { content });
        const updatedMessage = mapToAppMessage(response);

        setMessages((prev) =>
          prev.map((message) => (message.id === id ? updatedMessage : message))
        );

        return updatedMessage;
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error(`Failed to update message ${id}`);
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteMessage = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteChatMessage(id);
      setMessages((prev) => prev.filter((message) => message.id !== id));
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error(`Failed to delete message ${id}`);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSessionMessages = useCallback(
    async (sessionId: string): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        await deleteAllSessionMessages(sessionId);

        if (sessionId === activeSessionId) {
          setMessages([]);
        }
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error(`Failed to clear messages for session ${sessionId}`);
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [activeSessionId]
  );

  // When active session changes, fetch messages for that session
  useEffect(() => {
    if (activeSessionId) {
      fetchMessages(activeSessionId);
    } else {
      setMessages([]);
    }
  }, [activeSessionId, fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    fetchMessages,
    sendMessage,
    updateMessage,
    deleteMessage,
    clearSessionMessages,
    setActiveSessionId,
  };
}
