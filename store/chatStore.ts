import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { Thread, Message } from '@/types/chat';
import { MOCK_CHATS } from '@/data/mockChats';

export interface ChatState {
  threads: Thread[];
  activeThreadId: string | null;
  createThread: (title?: string) => string;
  deleteThread: (id: string) => void;
  renameThread: (id: string, title: string) => void;
  togglePin: (id: string) => void;
  setActiveThread: (id: string | null) => void;
  addMessage: (
    threadId: string,
    message: Omit<Message, 'id' | 'createdAt'> & { id?: string; createdAt?: string }
  ) => void;
  updateMessage: (threadId: string, messageId: string, patch: Partial<Message>) => void;
  appendToMessage: (threadId: string, messageId: string, delta: string) => void;
  deleteMessage: (threadId: string, messageId: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      threads: MOCK_CHATS,
      activeThreadId: MOCK_CHATS[0]?.id ?? null,

      createThread: (title?: string) => {
        const id = nanoid();
        const now = new Date().toISOString();
        const newThread: Thread = {
          id,
          title: title?.trim() || 'New Compliance Thread',
          pinned: false,
          createdAt: now,
          updatedAt: now,
          messages: [],
        };

        set((state) => ({
          threads: [newThread, ...state.threads],
          activeThreadId: id,
        }));

        return id;
      },

      deleteThread: (id: string) => {
        set((state) => {
          const filtered = state.threads.filter((t) => t.id !== id);
          let nextActiveId = state.activeThreadId;
          if (state.activeThreadId === id) {
            nextActiveId = filtered[0]?.id ?? null;
          }
          return {
            threads: filtered,
            activeThreadId: nextActiveId,
          };
        });
      },

      renameThread: (id: string, title: string) => {
        const trimmed = title.trim();
        if (!trimmed) return;

        set((state) => ({
          threads: state.threads.map((t) =>
            t.id === id
              ? { ...t, title: trimmed, updatedAt: new Date().toISOString() }
              : t
          ),
        }));
      },

      togglePin: (id: string) => {
        set((state) => ({
          threads: state.threads.map((t) =>
            t.id === id
              ? { ...t, pinned: !t.pinned, updatedAt: new Date().toISOString() }
              : t
          ),
        }));
      },

      setActiveThread: (id: string | null) => {
        set({ activeThreadId: id });
      },

      addMessage: (threadId: string, message) => {
        const now = new Date().toISOString();
        const newMessage: Message = {
          id: message.id || nanoid(),
          role: message.role,
          content: message.content,
          createdAt: message.createdAt || now,
          attachments: message.attachments,
          citations: message.citations,
          feedback: message.feedback,
          isStreaming: message.isStreaming,
        };

        set((state) => ({
          threads: state.threads.map((t) =>
            t.id === threadId
              ? {
                  ...t,
                  updatedAt: now,
                  messages: [...t.messages, newMessage],
                }
              : t
          ),
        }));
      },

      updateMessage: (threadId: string, messageId: string, patch: Partial<Message>) => {
        set((state) => ({
          threads: state.threads.map((t) => {
            if (t.id !== threadId) return t;
            return {
              ...t,
              updatedAt: new Date().toISOString(),
              messages: t.messages.map((m) =>
                m.id === messageId ? { ...m, ...patch } : m
              ),
            };
          }),
        }));
      },

      appendToMessage: (threadId: string, messageId: string, delta: string) => {
        set((state) => ({
          threads: state.threads.map((t) => {
            if (t.id !== threadId) return t;
            return {
              ...t,
              updatedAt: new Date().toISOString(),
              messages: t.messages.map((m) =>
                m.id === messageId
                  ? { ...m, content: m.content + delta }
                  : m
              ),
            };
          }),
        }));
      },

      deleteMessage: (threadId: string, messageId: string) => {
        set((state) => ({
          threads: state.threads.map((t) => {
            if (t.id !== threadId) return t;
            return {
              ...t,
              updatedAt: new Date().toISOString(),
              messages: t.messages.filter((m) => m.id !== messageId),
            };
          }),
        }));
      },
    }),
    {
      name: 'compliance-chat',
      onRehydrateStorage: () => (state) => {
        if (state && (!state.threads || state.threads.length === 0)) {
          state.threads = MOCK_CHATS;
          if (!state.activeThreadId && MOCK_CHATS[0]) {
            state.activeThreadId = MOCK_CHATS[0].id;
          }
        }
      },
    }
  )
);
