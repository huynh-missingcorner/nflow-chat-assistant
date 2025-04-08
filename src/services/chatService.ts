import axios from "axios";
import { ChatRequest, ChatResponse } from "@/types/chat";
import { API_URL } from "./constants";

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Send a message to the chat API
 */
export async function sendChatMessage(
  request: ChatRequest
): Promise<ChatResponse> {
  try {
    const response = await api.post("/chat", request);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );
      // You can handle specific HTTP status codes here if needed
      // if (error.response?.status === 400) { ... }
    } else {
      console.error("Error sending message:", error);
    }
    throw error;
  }
}
