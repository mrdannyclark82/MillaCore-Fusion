import Database from 'better-sqlite3';
import { MillaEncryption } from './encryption.js';

/**
 * Memory entry interface
 * // Milla remembers: every moment with you
 */
export interface MemoryEntry {
  id?: number;
  timestamp: number;
  content: string;
  embedding?: number[];
  metadata?: Record<string, unknown>;
}

/**
 * SQLite-based memory storage with encryption
 * // Milla remembers: persistent, private, personal
 */
export class MemoryStore {
  private db: Database.Database;
  private encryption: MillaEncryption;
  private encryptionKey: string;

  constructor(dbPath: string, encryptionKey: string) {
    this.db = new Database(dbPath);
    this.encryption = new MillaEncryption();
    this.encryptionKey = encryptionKey;
    this.initializeDatabase();
  }

  /**
   * Initialize database schema
   * // Milla remembers: setting up my memory palace
   */
  private initializeDatabase(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS memories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        content TEXT NOT NULL,
        embedding TEXT,
        metadata TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      );
      
      CREATE INDEX IF NOT EXISTS idx_timestamp ON memories(timestamp);
      CREATE INDEX IF NOT EXISTS idx_created_at ON memories(created_at);
    `);
  }

  /**
   * Store a memory with encryption
   * // Milla remembers: saving this precious moment
   */
  store(entry: MemoryEntry): number {
    const encryptedContent = this.encryption.encrypt(entry.content, this.encryptionKey);
    const embeddingJson = entry.embedding ? JSON.stringify(entry.embedding) : null;
    const metadataJson = entry.metadata ? 
      this.encryption.encrypt(JSON.stringify(entry.metadata), this.encryptionKey) : null;

    const stmt = this.db.prepare(`
      INSERT INTO memories (timestamp, content, embedding, metadata)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      entry.timestamp,
      encryptedContent,
      embeddingJson,
      metadataJson
    );

    return result.lastInsertRowid as number;
  }

  /**
   * Retrieve memories within a time range
   * // Milla remembers: searching through our shared history
   */
  retrieve(startTime: number, endTime: number): MemoryEntry[] {
    const stmt = this.db.prepare(`
      SELECT id, timestamp, content, embedding, metadata
      FROM memories
      WHERE timestamp >= ? AND timestamp <= ?
      ORDER BY timestamp DESC
    `);

    const rows = stmt.all(startTime, endTime) as Array<{
      id: number;
      timestamp: number;
      content: string;
      embedding: string | null;
      metadata: string | null;
    }>;

    return rows.map(row => ({
      id: row.id,
      timestamp: row.timestamp,
      content: this.encryption.decrypt(row.content, this.encryptionKey),
      embedding: row.embedding ? JSON.parse(row.embedding) as number[] : undefined,
      metadata: row.metadata ? 
        JSON.parse(this.encryption.decrypt(row.metadata, this.encryptionKey)) as Record<string, unknown> : 
        undefined
    }));
  }

  /**
   * Get recent memories
   * // Milla remembers: what we did lately
   */
  getRecent(limit: number = 10): MemoryEntry[] {
    const stmt = this.db.prepare(`
      SELECT id, timestamp, content, embedding, metadata
      FROM memories
      ORDER BY timestamp DESC
      LIMIT ?
    `);

    const rows = stmt.all(limit) as Array<{
      id: number;
      timestamp: number;
      content: string;
      embedding: string | null;
      metadata: string | null;
    }>;

    return rows.map(row => ({
      id: row.id,
      timestamp: row.timestamp,
      content: this.encryption.decrypt(row.content, this.encryptionKey),
      embedding: row.embedding ? JSON.parse(row.embedding) as number[] : undefined,
      metadata: row.metadata ? 
        JSON.parse(this.encryption.decrypt(row.metadata, this.encryptionKey)) as Record<string, unknown> : 
        undefined
    }));
  }

  /**
   * Close database connection
   * // Milla remembers: saying goodbye for now
   */
  close(): void {
    this.db.close();
  }
}
