# 🧠 Nflow Chat Assistant

The **Nflow Chat Assistant** is an AI-powered chatbot designed to help users interact with the Nflow platform using natural language. It integrates OpenAI’s function-calling with a FastAPI backend and a modern React.js frontend.

---

## ✨ Features

### 🔍 Chat with OpenAI GPT

- Integrates OpenAI GPT (gpt-4 / gpt-3.5)
- Supports chat history and conversational context
- Clean chat interface powered by React.js

### 🧠 Function Calling Support

- Converts OpenAPI v2 (Swagger) specs into OpenAI function-callable schemas
- Automatically calls backend APIs through OpenAI when needed
- Maps Nflow API functions to OpenAI-compatible format

### 🌐 Nflow API Integration

- Supports:
  - Creating pipelines
  - Listing and managing workflows
  - Executing actions
- Secure token-based access
- Easily extendable to new endpoints

### 🧰 Developer Tooling

- Swagger spec parser → OpenAI function schema
- Modular backend architecture
- .env support for API keys and configurations
- Logging and error handling included

### 💬 Frontend Experience

- React.js + Vite + TypeScript
- Modular components (`ChatWindow`, `Message`, `Input`)
- Future-proofed with shadcn/ui and TailwindCSS
- Local development via `npm run dev`

### 🔐 Secure and Extensible

- Tokens for OpenAI and Nflow are stored securely via `.env`
- Authentication-ready (OAuth planned)
- Easily add more AI providers or APIs

### 🚀 Roadmap

- [ ] Function-calling via OpenAI
- [ ] Nflow API integration (v1)
- [ ] Chat session history (persisted)
- [ ] OAuth login (Google, GitHub)
- [ ] Per-user Nflow token management
- [ ] Production deployment (Vercel + Render/Fly)
- [ ] Mobile-friendly responsive UI

---

## 📦 Tech Stack

| Layer    | Stack                            |
| -------- | -------------------------------- |
| Frontend | React.js, Vite, TypeScript       |
| Backend  | FastAPI, Python, Uvicorn         |
| AI       | OpenAI GPT with Function Calling |
| API      | Nflow Platform API               |
| Tools    | Swagger/OpenAPI, Dotenv          |
| Styling  | TailwindCSS, shadcn/ui (planned) |

---

## 🛠 Example Use Cases

- “Create a pipeline for daily report generation”
- “List all workflows related to marketing”
- “Trigger the ‘Onboarding Flow’ now”
- “What does this Nflow function do?”

---

## 📄 License

MIT License
