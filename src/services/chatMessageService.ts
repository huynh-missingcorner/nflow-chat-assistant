import axios from "axios";
import { Message } from "@/interfaces/interfaces";
import { API_URL } from "./constants";

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface CreateMessageParams {
  sessionId: string;
  content: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
}

interface UpdateMessageParams {
  content: string;
}

interface MessageResponse {
  id: string;
  sessionId: string;
  content: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
  createdAt: string;
  updatedAt: string;
}

interface DeleteMessageResponse {
  success: boolean;
  message: string;
}

/**
 * Create a new chat message
 */
export async function createChatMessage(
  params: CreateMessageParams
): Promise<MessageResponse> {
  try {
    const response = await api.post("/chat-messages", params);
    return response.data;
  } catch (error) {
    console.error("Error creating chat message:", error);
    throw error;
  }
}

/**
 * Fetch all messages, optionally filtered by session ID
 */
export async function getChatMessages(
  sessionId?: string
): Promise<MessageResponse[]> {
  try {
    const response = await api.get("/chat-messages", {
      params: sessionId ? { sessionId } : undefined,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw error;
  }
}

/**
 * Fetch a single message by ID
 */
export async function getChatMessageById(id: string): Promise<MessageResponse> {
  try {
    const response = await api.get(`/chat-messages/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching chat message with ID: ${id}:`, error);
    throw error;
  }
}

/**
 * Update an existing message
 */
export async function updateChatMessage(
  id: string,
  params: UpdateMessageParams
): Promise<MessageResponse> {
  try {
    const response = await api.patch(`/chat-messages/${id}`, params);
    return response.data;
  } catch (error) {
    console.error(`Error updating chat message with ID: ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a message
 */
export async function deleteChatMessage(
  id: string
): Promise<DeleteMessageResponse> {
  try {
    const response = await api.delete(`/chat-messages/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting chat message with ID: ${id}:`, error);
    throw error;
  }
}

/**
 * Delete all messages for a session
 */
export async function deleteAllSessionMessages(
  sessionId: string
): Promise<void> {
  try {
    await api.delete(`/chat-messages/session/${sessionId}`);
  } catch (error) {
    console.error(
      `Error deleting messages for session ID: ${sessionId}:`,
      error
    );
    throw error;
  }
}

/**
 * Convert API response to application Message format
 */
export function mapToAppMessage(message: MessageResponse): Message {
  return {
    id: message.id,
    content: message.content,
    role: message.role.toLowerCase() as "user" | "assistant" | "system",
  };
}
