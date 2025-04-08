export interface Session {
  id: string;
  title: string;
  timestamp?: string;
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatRequest {
  sessionId: string;
  message: string;
}

export interface ChatResponse {
  sessionId: string;
  reply: string;
  appUrl?: string;
}

export interface CreateSessionRequest {
  title: string;
}

export interface UpdateSessionRequest {
  title?: string;
  archived?: boolean;
}
