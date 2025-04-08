import { ChatRequest, ChatResponse } from "@/types/chat";

const API_URL = "http://localhost:3000";

interface ApiError extends Error {
  status?: number;
}

/**
 * Send a message to the chat API
 */
export async function sendChatMessage(
  request: ChatRequest
): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = new Error("Failed to send message") as ApiError;
      error.status = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}
