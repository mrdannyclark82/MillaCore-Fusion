// Common type definitions shared across all MillaCore applications

/**
 * Base message structure for AI conversations
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/**
 * AI provider configuration
 */
export interface AIProviderConfig {
  provider: 'gemini' | 'grok' | 'xai' | 'openai';
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Memory entry structure for vector storage
 */
export interface MemoryEntry {
  id: string;
  content: string;
  embedding?: number[];
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Configuration options
 */
export interface Config {
  ai: AIProviderConfig;
  memory: {
    enabled: boolean;
    indexPath: string;
    dimension: number;
    maxVectors: number;
  };
  encryption: {
    enabled: boolean;
    key: string;
    salt: string;
  };
  server: {
    host: string;
    port: number;
    corsOrigins: string[];
  };
  voice: {
    enabled: boolean;
    provider: 'elevenlabs' | 'google' | 'browser';
    model?: string;
  };
}

/**
 * API response wrapper
 */
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Vector search result
 */
export interface SearchResult {
  id: string;
  content: string;
  score: number;
  metadata?: Record<string, unknown>;
}
