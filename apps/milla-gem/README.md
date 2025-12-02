
# Google Gemini Cloud Assistant: Milla AI

![Milla AI Assistant](https://storage.googleapis.com/aida-prod/data/static/user_uploads/0/2024-07-15/18-05-01/image.jpeg)

**Milla AI** is an advanced, multimodal virtual assistant powered by the Google Gemini API. Built with React and TypeScript, this project serves as a comprehensive showcase of Gemini's powerful capabilities, including real-time voice conversations, advanced function calling with rich UI, multi-turn conversational reasoning, and image generation.

---

## ✨ Features

Milla is more than just a chatbot; she's a full-featured assistant designed to be helpful, intuitive, and safe.

### 🗣️ Core Conversational AI
- **Real-time Voice Conversation**: Engage in low-latency, natural voice conversations with live audio streaming to and from the Gemini API.
- **Live Transcription**: See a real-time transcription of both your speech and Milla's responses appear in the chat.
- **Streaming Text Responses**: Milla's text-based answers are streamed word-by-word for a dynamic, responsive feel.
- **Conversation Memory**: Milla remembers the context of the current conversation, allowing for natural follow-up questions.
- **Customizable Persona**: Easily edit Milla's core system instructions in the settings panel to change her personality, expertise, and response style.
- **Persistent Settings**: User preferences for persona, voice, and service connections are saved in the browser's `localStorage`.

### 🛠️ Advanced Tool Integration (Function Calling)
Milla can use a wide array of tools to perform actions and retrieve information, displaying results in rich, interactive UI components.

- **Proactive Action Suggestions**: Milla analyzes conversations and suggests relevant tool-based actions as clickable buttons.
- **Multi-turn Tool Conversations**: If Milla needs more information to complete a task (e.g., "Book a flight"), she will ask clarifying follow-up questions.
- **User Confirmation Flow**: For critical actions like sending an email or scheduling a meeting, Milla presents a draft for user approval before executing.

#### Implemented Tools & UI Cards:
- **Code Execution**: Run Python code in a simulated environment, displayed in a `ColabResultCard`.
- **Interactive Code Debugger**: A step-by-step visual debugger for Python code.
- **Google Search**: Access real-time information from the web, with cited sources.
- **Stock Prices**: Get the latest stock price in an interactive `StockCard` with a historical chart.
- **Calendar Management**: Schedule meetings (`MeetingCard`) and check your agenda (`CalendarEventsCard`).
- **Email**: Draft and send emails, confirmed via a dedicated `EmailCard`.
- **Interactive To-Do List**: Manage a to-do list with a `ToDoListCard` that allows you to check off items directly in the UI.
- **Package Tracking**: View a visual timeline of your package's status with the `PackageTrackerCard`.
- **News Headlines**: Get the latest news displayed in a clean, article-style `NewsCard`.
- **Reminders**: Set reminders that are confirmed with a dedicated `ReminderCard`.
- **Media Playback**: Play music (`NowPlayingCard`) or YouTube videos (`YouTubePlayer`).
- **Flight Booking**: A multi-turn conversation to book flights, confirmed in a `FlightCard`.
- **Messaging**: Draft messages for Google Voice or Facebook Messenger in a `MessagingCard`.

### 👁️ Multimodal Capabilities
- **Image Understanding**: Attach an image to your message, and Milla can analyze its content and answer questions.
- **Image Generation**: Ask Milla to create an image from a text description (e.g., "Generate an image of a robot on a skateboard"). The generated image appears directly in an `ImageResultCard`.

---

## 🚀 Tech Stack

- **Frontend**: [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **AI/LLM**: [Google Gemini API](https://ai.google.dev/) (`@google/genai`)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Real-time Audio**: Browser Web Audio API & `ScriptProcessorNode`
- **Unique IDs**: `uuid`

---

## 🔧 Setup and Running the Project

This project is a frontend application designed to run in a browser environment where a Gemini API key is securely provided.

### Prerequisites
- A valid Google Gemini API Key.

### Installation & Running
1.  **Environment Variable**: Ensure your environment is configured to provide the Gemini API key as `process.env.API_KEY`. The application is hardcoded to look for this variable.
2.  **Run the App**: Serve the project files using a standard development server. All dependencies are managed via an `importmap` in `index.html` and are loaded from a CDN at runtime.

---

## 📁 Project Structure

```
.
├── components/          # All React components
│   ├── icons/           # SVG icon components
│   ├── ChatWindow.tsx   # Displays the stream of messages
│   ├── InputBar.tsx     # Handles user input, image attachment, and voice control
│   ├── SettingsPanel.tsx# UI for managing persona, voice, and connections
│   ├── ToolResult.tsx   # Dispatches different tool results to their specific UI cards (e.g., StockCard)
│   └── ...              # All other individual UI cards (StockCard.tsx, MeetingCard.tsx, etc.)
├── hooks/               # Custom React hooks
│   ├── useLiveConversation.ts # Manages the real-time Gemini Live API connection
│   └── useSpeech.ts     # Manages browser Speech Synthesis and Recognition
├── services/            # Business logic and external API communication
│   ├── geminiService.ts # Handles all interactions with the @google/genai SDK
│   └── apiService.ts    # A mock backend to simulate tool execution (e.g., fetching stocks)
├── types.ts             # Shared TypeScript type definitions
├── App.tsx              # Main application component, state management, and logic orchestration
├── index.html           # The entry point of the web application
└── index.tsx            # Renders the React application into the DOM
```

---

## 🔮 Future Work: The Path to Live Data

This prototype is a comprehensive blueprint. The next step is to transition from the simulated `apiService.ts` to a real, secure backend.

1.  **Backend & OAuth**: Build a backend server (e.g., Node.js) to handle Google OAuth 2.0, securely storing user tokens.
2.  **Replace Mocks with APIs**: Systematically replace each function in `apiService.ts` with authenticated calls to the actual Google APIs (Google Calendar, Gmail, etc.).
3.  **Deployment**: Deploy the frontend and the new secure backend to a cloud hosting provider.

