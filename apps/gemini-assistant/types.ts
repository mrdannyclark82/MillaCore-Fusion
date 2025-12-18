// This file defines shared types used across the application.

export enum MessageSender {
  USER = 'user',
  AI = 'ai',
  SYSTEM = 'system',
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface ToolCall {
  id: string;
  name: string;
  args: any;
  status?: 'pending' | 'success' | 'error' | 'pending_confirmation';
  result?: any;
  error?: any;
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  image?: string | null;
  sources?: GroundingSource[];
  toolCalls?: ToolCall[];
  isLive?: boolean;
  suggestedAction?: ToolCall;
}

export interface VoiceOption {
  name: string;
  uri: string;
}

export interface DebugStep {
  lineNumber: number;
  variables: Record<string, any>;
  output: string | undefined;
}

export interface DebugError {
  line: number;
  message: string;
}

export interface DebugResult {
  steps: DebugStep[];
  error: DebugError | null;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  htmlLink: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: { email: string }[];
}

export interface SentEmail {
  recipient: string;
  subject: string;
  body: string;
}

export interface ToDoList {
  items: string[];
}

export interface NewsArticle {
  title: string;
  source: string;
  summary: string;
}

export interface NewsHeadlines {
  articles: NewsArticle[];
}

export interface PackageStatus {
  trackingNumber: string;
  carrier: string;
  status: string;
  description: string;
  step: number; // e.g., 1 of 4
}

export interface ColabResult {
  code: string;
  output: string;
}

export interface Reminder {
  text: string;
  time: string;
  formattedTime: string;
}

export interface SentMessage {
    recipient: string;
    message: string;
}

export interface FlightDetails {
    destination: string;
    departureDate: string;
    returnDate?: string;
    price: string;
    airline: string;
}