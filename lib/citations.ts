import { Citation } from '@/types/chat';
import { CITATIONS_BY_ID } from '@/data/mockCitations';

export const CITE_REGEX = /\[\[cite:([a-zA-Z0-9_-]+)\]\]/g;
export const PARTIAL_CITE_REGEX = /\[\[[a-zA-Z0-9_:-]*$/;

export function getCitationById(id: string): Citation | null {
  if (id === 'finra-2210-d') return CITATIONS_BY_ID['finra-2210-s4'] ?? null;
  return CITATIONS_BY_ID[id] ?? null;
}

export function findCitationIds(text: string): string[] {
  if (!text) return [];
  const matches: string[] = [];
  const regex = new RegExp(CITE_REGEX.source, 'g');
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

export function getUniqueCitations(text: string): Citation[] {
  if (!text) return [];
  const ids = findCitationIds(text);
  const uniqueIds = Array.from(new Set(ids));
  return uniqueIds.map((id) => {
    const existing = getCitationById(id);
    if (existing) return existing;
    return {
      id,
      label: 'Unknown Source',
      source: `Citation ID: ${id}`,
      excerpt: 'No specific regulatory excerpt is currently registered for this citation identifier.',
      docUrl: '',
    };
  });
}

export function cleanStreamingContent(content: string, isStreaming?: boolean): string {
  if (!isStreaming || !content) return content;
  return content.replace(PARTIAL_CITE_REGEX, '');
}

export function formatContentForCopy(content: string): string {
  if (!content) return '';
  return content.replace(CITE_REGEX, (_match, id) => {
    const citation = getCitationById(id);
    return citation ? `[${citation.label}]` : `[${id}]`;
  });
}

