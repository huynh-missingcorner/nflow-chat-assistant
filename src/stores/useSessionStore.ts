import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Session } from "@/types/chat";
import {
  createChatSession,
  deleteChatSession,
  getAllChatSessions,
  updateChatSession,
} from "@/services/chatSessionService";
import { toast } from "sonner";

interface SessionState {
  // State
  sessions: Session[];
  activeSessionId: string;
  isLoading: boolean;
  error: Error | null;

  // Actions
  fetchSessions: () => Promise<void>;
  createSession: (title: string) => Promise<Session>;
  updateSession: (
    id: string,
    data: { title?: string; archived?: boolean }
  ) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  setActiveSession: (id: string) => void;
  updateSessionTitleFromSocket: (sessionId: string, title: string) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      // Initial state
      sessions: [],
      activeSessionId: "",
      isLoading: false,
      error: null,

      // Actions
      fetchSessions: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await getAllChatSessions();
          set({ sessions: data });

          // If there's no active session but we have sessions, set the first one as active
          const { activeSessionId } = get();
          if (!activeSessionId && data.length > 0) {
            set({ activeSessionId: data[0].id });
          }
        } catch (err) {
          const error =
            err instanceof Error ? err : new Error("Failed to fetch sessions");
          set({ error });
          toast.error("Failed to load chat sessions");
        } finally {
          set({ isLoading: false });
        }
      },

      createSession: async (title: string) => {
        set({ isLoading: true, error: null });
        try {
          const newSession = await createChatSession({ title });
          // Add new session to the top of the list
          set((state) => ({
            sessions: [newSession, ...state.sessions],
            activeSessionId: newSession.id,
          }));
          toast.success("New chat created");
          return newSession;
        } catch (err) {
          const error =
            err instanceof Error ? err : new Error("Failed to create session");
          set({ error });
          toast.error("Failed to create new chat");
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateSession: async (
        id: string,
        data: { title?: string; archived?: boolean }
      ) => {
        set({ isLoading: true, error: null });
        try {
          const updatedSession = await updateChatSession(id, data);
          set((state) => ({
            sessions: state.sessions.map((session) =>
              session.id === id ? updatedSession : session
            ),
          }));

          // If we archived the active session, select another one
          if (data.archived && id === get().activeSessionId) {
            const { sessions } = get();
            const nextSession = sessions.find(
              (session) => session.id !== id && !session.archived
            );
            if (nextSession) {
              set({ activeSessionId: nextSession.id });
            }
          }

          toast.success(data.archived ? "Session archived" : "Session updated");
        } catch (err) {
          const error =
            err instanceof Error ? err : new Error("Failed to update session");
          set({ error });
          toast.error("Failed to update session");
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteSession: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await deleteChatSession(id);

          // If we're deleting the active session, select a new one
          const { activeSessionId, sessions } = get();
          if (id === activeSessionId && sessions.length > 1) {
            const nextSession = sessions.find((session) => session.id !== id);
            if (nextSession) {
              set({ activeSessionId: nextSession.id });
            }
          }

          set((state) => ({
            sessions: state.sessions.filter((session) => session.id !== id),
          }));

          toast.success("Session deleted");
        } catch (err) {
          const error =
            err instanceof Error ? err : new Error("Failed to delete session");
          set({ error });
          toast.error("Failed to delete session");
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      setActiveSession: (id: string) => {
        set({ activeSessionId: id });
      },

      // Handle real-time session title updates from WebSocket
      updateSessionTitleFromSocket: (sessionId: string, title: string) => {
        console.log(
          `Received real-time title update for session ${sessionId}: ${title}`
        );

        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId ? { ...session, title } : session
          ),
        }));

        // Show a notification only if it's the active session
        if (sessionId === get().activeSessionId) {
          toast.info(`Chat renamed to "${title}"`);
        }
      },
    }),
    {
      name: "chat-sessions-storage",
    }
  )
);
