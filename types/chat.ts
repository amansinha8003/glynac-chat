export type MessageRole = 'user' | 'assistant';

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface Citation {
  id: string;
  label: string;
  source: string;
  excerpt: string;
  docUrl: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  attachments?: Attachment[];
  citations?: Citation[];
  feedback?: 'up' | 'down';
  isStreaming?: boolean;
}

export interface Thread {
  id: string;
  title: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}
