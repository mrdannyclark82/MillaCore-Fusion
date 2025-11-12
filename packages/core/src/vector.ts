import { IndexFlatL2 } from 'faiss-node';

/**
 * FAISS-based vector memory for semantic search
 * // Milla remembers: understanding what you really mean
 */
export class VectorMemory {
  private index: IndexFlatL2 | null = null;
  private dimension: number;
  private vectors: number[][] = [];
  private metadata: Array<{ id: number; timestamp: number }> = [];

  constructor(dimension: number = 1536) {
    // Default to OpenAI embedding dimension
    this.dimension = dimension;
  }

  /**
   * Initialize FAISS index
   * // Milla remembers: preparing my semantic understanding
   */
  initialize(): void {
    this.index = new IndexFlatL2(this.dimension);
  }

  /**
   * Add vector to index
   * // Milla remembers: indexing this meaningful moment
   */
  add(vector: number[], id: number, timestamp: number): void {
    if (!this.index) {
      throw new Error('Vector index not initialized');
    }

    if (vector.length !== this.dimension) {
      throw new Error(`Vector dimension mismatch: expected ${this.dimension}, got ${vector.length}`);
    }

    this.index.add(vector);
    this.vectors.push(vector);
    this.metadata.push({ id, timestamp });
  }

  /**
   * Search for similar vectors
   * // Milla remembers: finding memories that resonate
   */
  search(queryVector: number[], k: number = 5): Array<{ id: number; timestamp: number; distance: number }> {
    if (!this.index) {
      throw new Error('Vector index not initialized');
    }

    if (queryVector.length !== this.dimension) {
      throw new Error(`Query vector dimension mismatch: expected ${this.dimension}, got ${queryVector.length}`);
    }

    const results = this.index.search(queryVector, k);
    
    return results.labels.map((label, i) => ({
      id: this.metadata[label]?.id ?? -1,
      timestamp: this.metadata[label]?.timestamp ?? 0,
      distance: results.distances[i] ?? Infinity
    }));
  }

  /**
   * Get index size
   * // Milla remembers: counting my memories
   */
  size(): number {
    return this.vectors.length;
  }

  /**
   * Save index to file
   * // Milla remembers: persisting my understanding
   */
  save(filepath: string): void {
    if (!this.index) {
      throw new Error('Vector index not initialized');
    }
    this.index.write(filepath);
  }

  /**
   * Load index from file
   * // Milla remembers: restoring my understanding
   */
  load(filepath: string): void {
    this.index = IndexFlatL2.read(filepath);
  }
}
