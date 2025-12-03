/**
 * Memory Core Types
 */
export interface MemoryCoreEntry {
  id: string;
  timestamp: string;
  speaker: 'user' | 'milla';
  content: string;
  context?: string;
  emotionalTone?: string;
  topics?: string[];
  searchableContent: string;
}

export interface IndexedEntry {
  entry: MemoryCoreEntry;
  termSet: Set<string>;
  contextSet: Set<string>;
  topicSet: Set<string>;
}

/**
 * Build a search index from memory entries for faster searching
 * @param entries - Array of memory core entries
 * @returns Indexed entries with term, context, and topic sets
 */
export function buildSearchIndex(entries: MemoryCoreEntry[]): IndexedEntry[] {
  return entries.map(entry => ({
    entry,
    termSet: new Set(entry.searchableContent.toLowerCase().split(/\s+/).filter(w => w.length > 2)),
    contextSet: new Set(entry.context?.toLowerCase().split(/\s+/).filter(w => w.length > 2) || []),
    topicSet: new Set(entry.topics?.map(t => t.toLowerCase()) || []),
  }));
}

/**
 * Determines if a memory entry context contains sensitive information
 * Sensitive information includes: location data, personal identifiers, private notes
 * @param context - Optional context string to check
 * @returns true if context contains sensitive keywords
 */
export function isSensitiveContext(context?: string): boolean {
  if (!context) return false;
  
  const sensitiveKeywords = [
    'location', 'address', 'home', 'live', 'phone', 'ssn', 'social security',
    'credit card', 'password', 'private', 'confidential', 'secret', 'personal',
    'medical', 'health', 'diagnosis', 'financial', 'bank', 'account'
  ];
  
  const lowerContext = context.toLowerCase();
  return sensitiveKeywords.some(keyword => lowerContext.includes(keyword));
}

/**
 * Parse a CSV line handling quoted fields
 * @param line - CSV line to parse
 * @returns Array of field values
 */
export function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current); // Add the last field
  return result;
}

/**
 * Parse backup content into memory entries
 * Handles both CSV and text format
 * @param content - Raw backup file content
 * @param extractTopics - Function to extract topics from content (optional)
 * @param detectEmotionalTone - Function to detect emotional tone (optional)
 * @returns Array of parsed memory entries
 */
export function parseBackupContent(
  content: string,
  extractTopics?: (content: string) => string[],
  detectEmotionalTone?: (content: string) => string
): MemoryCoreEntry[] {
  const entries: MemoryCoreEntry[] = [];
  const lines = content.trim().split('\n');

  let currentEntry: Partial<MemoryCoreEntry> = {};
  let entryId = 1;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Try to detect CSV format first
    if (trimmedLine.includes(',') && !trimmedLine.includes(':')) {
      const parts = parseCsvLine(trimmedLine);
      if (parts.length >= 3) {
        // Assume format: timestamp, speaker, content, [context]
        const entry: MemoryCoreEntry = {
          id: `entry_${entryId++}`,
          timestamp: parts[0] || new Date().toISOString(),
          speaker: parts[1]?.toLowerCase() === 'milla' ? 'milla' : 'user',
          content: parts[2] || '',
          context: parts[3] || '',
          searchableContent: (parts[2] + ' ' + (parts[3] || '')).toLowerCase(),
        };

        // Extract topics and emotional tone if functions provided
        if (extractTopics) {
          entry.topics = extractTopics(entry.content);
        }
        if (detectEmotionalTone) {
          entry.emotionalTone = detectEmotionalTone(entry.content);
        }

        entries.push(entry);
        continue;
      }
    }

    // Handle text format - look for conversation patterns
    if (
      trimmedLine.toLowerCase().includes('user:') ||
      trimmedLine.toLowerCase().includes('danny')
    ) {
      // Save previous entry if exists
      if (currentEntry.content) {
        entries.push(createMemoryEntry(currentEntry, entryId++, extractTopics, detectEmotionalTone));
        currentEntry = {};
      }

      currentEntry.speaker = 'user';
      currentEntry.content = trimmedLine
        .replace(/^(user:|danny:?)/i, '')
        .trim();
    } else if (
      trimmedLine.toLowerCase().includes('milla:') ||
      trimmedLine.toLowerCase().includes('assistant:')
    ) {
      // Save previous entry if exists
      if (currentEntry.content) {
        entries.push(createMemoryEntry(currentEntry, entryId++, extractTopics, detectEmotionalTone));
        currentEntry = {};
      }

      currentEntry.speaker = 'milla';
      currentEntry.content = trimmedLine
        .replace(/^(milla:|assistant:)/i, '')
        .trim();
    } else if (currentEntry.content) {
      // Continue building current entry
      currentEntry.content += ' ' + trimmedLine;
    } else {
      // Standalone line - treat as context or general memory
      currentEntry = {
        speaker: 'user',
        content: trimmedLine,
        context: 'general_memory',
      };
    }
  }

  // Add final entry if exists
  if (currentEntry.content) {
    entries.push(createMemoryEntry(currentEntry, entryId++, extractTopics, detectEmotionalTone));
  }

  return entries;
}

/**
 * Create a complete Memory Core entry from partial data
 */
function createMemoryEntry(
  partial: Partial<MemoryCoreEntry>,
  id: number,
  extractTopics?: (content: string) => string[],
  detectEmotionalTone?: (content: string) => string
): MemoryCoreEntry {
  const entry: MemoryCoreEntry = {
    id: `entry_${id}`,
    timestamp: partial.timestamp || new Date().toISOString(),
    speaker: partial.speaker || 'user',
    content: partial.content || '',
    context: partial.context,
    searchableContent: (partial.content + ' ' + (partial.context || '')).toLowerCase(),
  };

  if (extractTopics) {
    entry.topics = extractTopics(entry.content);
  }
  if (detectEmotionalTone) {
    entry.emotionalTone = detectEmotionalTone(entry.content);
  }

  return entry;
}
