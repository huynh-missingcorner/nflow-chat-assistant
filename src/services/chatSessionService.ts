import axios from "axios";
import { Session } from "@/types/chat";
import { API_URL } from "./constants";

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface CreateSessionParams {
  title: string;
}

interface UpdateSessionParams {
  title?: string;
  archived?: boolean;
}

/**
 * Create a new chat session
 */
export async function createChatSession(
  params: CreateSessionParams
): Promise<Session> {
  try {
    const response = await api.post("/chat-sessions", params);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error creating chat session:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error creating chat session:", error);
    }
    throw error;
  }
}

/**
 * Fetch all chat sessions
 */
export async function getAllChatSessions(): Promise<Session[]> {
  try {
    const response = await api.get("/chat-sessions");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching chat sessions:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error fetching chat sessions:", error);
    }
    throw error;
  }
}

/**
 * Fetch a single chat session by ID
 */
export async function getChatSessionById(id: string): Promise<Session> {
  try {
    const response = await api.get(`/chat-sessions/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Error fetching chat session with ID: ${id}:`,
        error.response?.data || error.message
      );
    } else {
      console.error(`Error fetching chat session with ID: ${id}:`, error);
    }
    throw error;
  }
}

/**
 * Update an existing chat session
 */
export async function updateChatSession(
  id: string,
  params: UpdateSessionParams
): Promise<Session> {
  try {
    const response = await api.patch(`/chat-sessions/${id}`, params);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Error updating chat session with ID: ${id}:`,
        error.response?.data || error.message
      );
    } else {
      console.error(`Error updating chat session with ID: ${id}:`, error);
    }
    throw error;
  }
}

/**
 * Delete a chat session
 */
export async function deleteChatSession(id: string): Promise<void> {
  try {
    await api.delete(`/chat-sessions/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Error deleting chat session with ID: ${id}:`,
        error.response?.data || error.message
      );
    } else {
      console.error(`Error deleting chat session with ID: ${id}:`, error);
    }
    throw error;
  }
}
