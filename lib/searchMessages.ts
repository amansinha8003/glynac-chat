import { Message } from '@/types/chat';

export interface SearchMatch {
  id: string;
  messageId: string;
  type: 'content' | 'attachment';
  attachmentId?: string;
  startIndex: number;
  endIndex: number;
  matchIndex: number;
  text: string;
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function searchMessages(messages: Message[], query: string): SearchMatch[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const lowerQuery = trimmed.toLowerCase();
  const queryLen = trimmed.length;
  const results: SearchMatch[] = [];
  let globalIndex = 0;

  for (const message of messages) {
    // 1. Search in attachment file names
    if (message.attachments) {
      for (const att of message.attachments) {
        const attLower = att.name.toLowerCase();
        let pos = 0;
        while ((pos = attLower.indexOf(lowerQuery, pos)) !== -1) {
          results.push({
            id: `search-match-${globalIndex}`,
            messageId: message.id,
            type: 'attachment',
            attachmentId: att.id,
            startIndex: pos,
            endIndex: pos + queryLen,
            matchIndex: globalIndex,
            text: att.name.slice(pos, pos + queryLen),
          });
          globalIndex++;
          pos += queryLen;
        }
      }
    }

    // 2. Search in message content
    if (message.content) {
      const contentLower = message.content.toLowerCase();
      let pos = 0;
      while ((pos = contentLower.indexOf(lowerQuery, pos)) !== -1) {
        results.push({
          id: `search-match-${globalIndex}`,
          messageId: message.id,
          type: 'content',
          startIndex: pos,
          endIndex: pos + queryLen,
          matchIndex: globalIndex,
          text: message.content.slice(pos, pos + queryLen),
        });
        globalIndex++;
        pos += queryLen;
      }
    }
  }

  return results;
}
