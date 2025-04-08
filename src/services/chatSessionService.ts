import { Session } from "@/types/chat";

const API_URL = "http://localhost:3000";

interface CreateSessionParams {
  title: string;
}

interface UpdateSessionParams {
  title?: string;
  archived?: boolean;
}

interface ApiError extends Error {
  status?: number;
}

/**
 * Create a new chat session
 */
export async function createChatSession(
  params: CreateSessionParams
): Promise<Session> {
  try {
    const response = await fetch(`${API_URL}/chat-sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = new Error("Failed to create chat session") as ApiError;
      error.status = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating chat session:", error);
    throw error;
  }
}

/**
 * Fetch all chat sessions
 */
export async function getAllChatSessions(): Promise<Session[]> {
  try {
    const response = await fetch(`${API_URL}/chat-sessions`);

    if (!response.ok) {
      const error = new Error("Failed to fetch chat sessions") as ApiError;
      error.status = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    throw error;
  }
}

/**
 * Fetch a single chat session by ID
 */
export async function getChatSessionById(id: string): Promise<Session> {
  try {
    const response = await fetch(`${API_URL}/chat-sessions/${id}`);

    if (!response.ok) {
      const error = new Error(
        `Failed to fetch chat session with ID: ${id}`
      ) as ApiError;
      error.status = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching chat session with ID: ${id}:`, error);
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
    const response = await fetch(`${API_URL}/chat-sessions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = new Error(
        `Failed to update chat session with ID: ${id}`
      ) as ApiError;
      error.status = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating chat session with ID: ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a chat session
 */
export async function deleteChatSession(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/chat-sessions/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = new Error(
        `Failed to delete chat session with ID: ${id}`
      ) as ApiError;
      error.status = response.status;
      throw error;
    }
  } catch (error) {
    console.error(`Error deleting chat session with ID: ${id}:`, error);
    throw error;
  }
}
