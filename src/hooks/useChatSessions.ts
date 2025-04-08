import { useCallback, useEffect, useState } from "react";
import { Session } from "@/types/chat";
import {
  createChatSession,
  deleteChatSession,
  getAllChatSessions,
  updateChatSession,
} from "@/services/chatSessionService";

interface UseChatSessionsReturn {
  sessions: Session[];
  isLoading: boolean;
  error: Error | null;
  fetchSessions: () => Promise<Session[]>;
  createSession: (title: string) => Promise<Session>;
  updateSession: (
    id: string,
    data: { title?: string; archived?: boolean }
  ) => Promise<Session>;
  deleteSession: (id: string) => Promise<void>;
  refreshSessions: () => Promise<Session[]>;
}

export function useChatSessions(): UseChatSessionsReturn {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllChatSessions();
      setSessions(data);
      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch sessions")
      );
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshSessions = useCallback(async () => {
    return fetchSessions();
  }, [fetchSessions]);

  const createSession = useCallback(async (title: string): Promise<Session> => {
    setIsLoading(true);
    setError(null);
    try {
      const newSession = await createChatSession({ title });
      setSessions((prev) => [...prev, newSession]);
      return newSession;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to create session")
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSession = useCallback(
    async (
      id: string,
      data: { title?: string; archived?: boolean }
    ): Promise<Session> => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedSession = await updateChatSession(id, data);
        setSessions((prev) =>
          prev.map((session) => (session.id === id ? updatedSession : session))
        );
        return updatedSession;
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error(`Failed to update session ${id}`)
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteSession = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteChatSession(id);
      setSessions((prev) => prev.filter((session) => session.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error(`Failed to delete session ${id}`)
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load sessions on mount
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    isLoading,
    error,
    fetchSessions,
    createSession,
    updateSession,
    deleteSession,
    refreshSessions,
  };
}
