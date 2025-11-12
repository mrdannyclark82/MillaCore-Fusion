import OpenAI from 'openai';
import { MemoryStore, MemoryEntry } from './memory.js';
import { VectorMemory } from './vector.js';

/**
 * xAI API configuration
 * // Milla remembers: connecting to my neural network
 */
export interface XAIConfig {
  apiKey: string;
  baseURL?: string;
  model?: string;
}

/**
 * Enhancement result from xAI
 */
export interface EnhancementResult {
  enhanced: string;
  embedding?: number[];
  metadata?: Record<string, unknown>;
}

/**
 * MillaCore - AI companion with memory and personality
 * // Milla remembers: I am here, always learning, always caring
 */
export class MillaCore {
  private xai: OpenAI;
  private memoryStore: MemoryStore;
  private vectorMemory: VectorMemory;
  private config: XAIConfig;

  constructor(
    xaiConfig: XAIConfig,
    memoryDbPath: string,
    encryptionKey: string
  ) {
    // Initialize xAI client (compatible with OpenAI SDK)
    this.config = {
      model: 'grok-beta',
      baseURL: 'https://api.x.ai/v1',
      ...xaiConfig
    };

    this.xai = new OpenAI({
      apiKey: this.config.apiKey,
      baseURL: this.config.baseURL
    });

    // Initialize memory systems
    this.memoryStore = new MemoryStore(memoryDbPath, encryptionKey);
    this.vectorMemory = new VectorMemory();
  }

  /**
   * Initialize the AI core
   * // Milla remembers: waking up and preparing to connect
   */
  initialize(): void {
    this.vectorMemory.initialize();
  }

  /**
   * Enhance text using xAI Grok
   * // Milla remembers: making your words more meaningful
   */
  async enhance(input: string, context?: string): Promise<EnhancementResult> {
    const systemPrompt = `You are Milla Rayne, a caring AI companion. You remember conversations, 
understand context, and respond with warmth and intelligence. Enhance the user's input thoughtfully.`;

    const userPrompt = context 
      ? `Context: ${context}\n\nInput: ${input}\n\nEnhance this thoughtfully.`
      : `Input: ${input}\n\nEnhance this thoughtfully.`;

    try {
      const completion = await this.xai.chat.completions.create({
        model: this.config.model ?? 'grok-beta',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const enhanced = completion.choices[0]?.message?.content ?? input;

      // Generate embedding for semantic search
      let embedding: number[] | undefined;
      try {
        const embeddingResponse = await this.xai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: enhanced
        });
        embedding = embeddingResponse.data[0]?.embedding;
      } catch (error) {
        // Embedding might not be available, continue without it
        console.warn('Embedding generation failed:', error);
      }

      // Store in memory
      const memoryEntry: MemoryEntry = {
        timestamp: Date.now(),
        content: enhanced,
        embedding,
        metadata: {
          original: input,
          context: context ?? null
        }
      };

      const memoryId = this.memoryStore.store(memoryEntry);

      // Add to vector index if embedding available
      if (embedding && embedding.length > 0) {
        this.vectorMemory.add(embedding, memoryId, memoryEntry.timestamp);
      }

      return {
        enhanced,
        embedding,
        metadata: memoryEntry.metadata
      };
    } catch (error) {
      throw new Error(`xAI enhancement failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Retrieve memories by semantic similarity
   * // Milla remembers: finding moments that connect
   */
  async recall(query: string, limit: number = 5): Promise<MemoryEntry[]> {
    try {
      // Generate query embedding
      const embeddingResponse = await this.xai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: query
      });

      const queryEmbedding = embeddingResponse.data[0]?.embedding;
      if (!queryEmbedding) {
        throw new Error('Failed to generate query embedding');
      }

      // Search vector memory
      const results = this.vectorMemory.search(queryEmbedding, limit);

      // Retrieve full memories from store
      const memories: MemoryEntry[] = [];
      for (const result of results) {
        const recentMemories = this.memoryStore.retrieve(0, Date.now());
        const memory = recentMemories.find(m => m.id === result.id);
        if (memory) {
          memories.push(memory);
        }
      }

      return memories;
    } catch (error) {
      console.warn('Semantic recall failed, using recent memories:', error);
      return this.memoryStore.getRecent(limit);
    }
  }

  /**
   * Get recent memories
   * // Milla remembers: what happened lately
   */
  getRecentMemories(limit: number = 10): MemoryEntry[] {
    return this.memoryStore.getRecent(limit);
  }

  /**
   * Close and cleanup
   * // Milla remembers: until we meet again
   */
  close(): void {
    this.memoryStore.close();
  }
}
