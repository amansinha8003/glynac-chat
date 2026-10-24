import { create } from 'zustand';

export interface SearchState {
  isOpen: boolean;
  query: string;
  debouncedQuery: string;
  activeIndex: number;
  totalMatches: number;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  setQuery: (query: string) => void;
  setDebouncedQuery: (query: string) => void;
  setActiveIndex: (index: number) => void;
  setTotalMatches: (total: number) => void;
  nextMatch: () => void;
  prevMatch: () => void;
  resetSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  isOpen: false,
  query: '',
  debouncedQuery: '',
  activeIndex: 0,
  totalMatches: 0,

  openSearch: () => set({ isOpen: true }),

  closeSearch: () =>
    set({
      isOpen: false,
      query: '',
      debouncedQuery: '',
      activeIndex: 0,
      totalMatches: 0,
    }),

  toggleSearch: () =>
    set((state) =>
      state.isOpen
        ? {
            isOpen: false,
            query: '',
            debouncedQuery: '',
            activeIndex: 0,
            totalMatches: 0,
          }
        : { isOpen: true }
    ),

  setQuery: (query) => set({ query }),

  setDebouncedQuery: (debouncedQuery) =>
    set({
      debouncedQuery,
      activeIndex: 0,
    }),

  setActiveIndex: (activeIndex) => set({ activeIndex }),

  setTotalMatches: (totalMatches) =>
    set((state) => ({
      totalMatches,
      activeIndex:
        totalMatches === 0
          ? 0
          : state.activeIndex >= totalMatches
          ? 0
          : state.activeIndex,
    })),

  nextMatch: () =>
    set((state) => ({
      activeIndex:
        state.totalMatches > 0
          ? (state.activeIndex + 1) % state.totalMatches
          : 0,
    })),

  prevMatch: () =>
    set((state) => ({
      activeIndex:
        state.totalMatches > 0
          ? (state.activeIndex - 1 + state.totalMatches) % state.totalMatches
          : 0,
    })),

  resetSearch: () =>
    set({
      isOpen: false,
      query: '',
      debouncedQuery: '',
      activeIndex: 0,
      totalMatches: 0,
    }),
}));
