# Chat Application State Management Architecture

This chat application uses Zustand for state management, following a modular approach with multiple specialized stores.

## Store Architecture

The application state is divided into five specialized stores:

### 1. SessionStore (`useSessionStore.ts`)

Manages chat sessions and the active session state:

- List of available chat sessions
- Current active session
- CRUD operations for sessions
- Loading and error states

### 2. MessageStore (`useMessageStore.ts`)

Handles message data and operations:

- Messages for the current session
- Sending/receiving messages
- CRUD operations for messages
- AI response handling
- Loading and error states

### 3. SocketStore (`useSocketStore.ts`)

Manages WebSocket connections:

- WebSocket initialization and connection status
- Session joining/leaving
- Message sending via WebSocket
- Event listeners for real-time updates

### 4. UIStore (`useUIStore.ts`)

Controls UI-related state:

- Preview panel visibility
- Sidebar visibility
- UI preference persistence

### 5. UserStore (`useUserStore.ts`)

Manages user information:

- Current user profile
- Authentication state
- Sign-in/sign-out functionality

## Data Flow

1. **REST API First, Then WebSocket Updates**:

   - Initial data is loaded via REST API calls
   - Real-time updates are received via WebSocket
   - Changes are persisted back to the server via REST API

2. **Store Interaction**:
   - SessionStore provides the active session ID to MessageStore
   - MessageStore fetches messages for the active session
   - SocketStore connects to WebSocket and joins the active session
   - UI updates are triggered by state changes in the respective stores

## Integration with useSocket Hook

The `useSocket` hook connects the WebSocket to our Zustand stores:

- Initializes WebSocket connection on component mount
- Sets up event listeners for socket events
- Updates appropriate stores when socket events occur
- Joins/leaves sessions as the active session changes

## Persistence

Some stores use the Zustand persist middleware to save state to localStorage:

- SessionStore: Persists session list and active session
- UIStore: Persists UI preferences
- UserStore: Persists user information

## Best Practices

1. Each store follows single responsibility principle
2. State updates are performed immutably
3. Async operations include loading and error states
4. Toast notifications provide user feedback
5. WebSocket connection is established only once
6. Components access only the stores they need
