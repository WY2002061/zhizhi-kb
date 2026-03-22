import { create } from 'zustand';
import type { KnowledgeCard, Collection, AuditLog, PrivacyLevel, PrivacyPreference } from '../types';
import { sampleCards, sampleCollections, sampleAuditLogs } from '../data/sampleData';
import { saveToStorage, loadFromStorage, generateId } from '../utils/storage';

interface KnowledgeState {
  cards: KnowledgeCard[];
  collections: Collection[];
  auditLogs: AuditLog[];
  privacyPreferences: PrivacyPreference[];

  addCard: (card: Omit<KnowledgeCard, 'id' | 'createdAt' | 'updatedAt' | 'reviewCount' | 'nextReviewAt'>) => KnowledgeCard;
  updateCard: (id: string, updates: Partial<KnowledgeCard>) => void;
  deleteCard: (id: string) => void;
  toggleFavorite: (id: string) => void;
  markReviewed: (id: string) => void;

  addCollection: (col: Omit<Collection, 'id' | 'createdAt'>) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;

  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  clearAuditLogs: () => void;

  setPrivacyPreference: (pref: PrivacyPreference) => void;
  getPrivacyPreference: (type: string) => PrivacyPreference | undefined;

  importData: (data: { cards?: KnowledgeCard[]; collections?: Collection[] }) => { cardsAdded: number; collectionsAdded: number };
  batchDeleteCards: (ids: string[]) => void;
  batchUpdatePrivacy: (ids: string[], level: PrivacyLevel) => void;
  batchMoveCollection: (ids: string[], collectionId: string | null) => void;

  getAllTags: () => { name: string; count: number }[];
  getCardsByCollection: (colId: string) => KnowledgeCard[];
  searchCards: (query: string) => KnowledgeCard[];
}

const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 60];
const DAY = 86400000;

function getNextReviewTime(reviewCount: number): number {
  const idx = Math.min(reviewCount, REVIEW_INTERVALS.length - 1);
  return Date.now() + REVIEW_INTERVALS[idx] * DAY;
}

export const useKnowledgeStore = create<KnowledgeState>((set, get) => ({
  cards: loadFromStorage<KnowledgeCard[]>('cards', sampleCards),
  collections: loadFromStorage<Collection[]>('collections', sampleCollections),
  auditLogs: loadFromStorage<AuditLog[]>('auditLogs', sampleAuditLogs),
  privacyPreferences: loadFromStorage<PrivacyPreference[]>('privacyPrefs', []),

  addCard: (cardData) => {
    const newCard: KnowledgeCard = {
      ...cardData,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      reviewCount: 0,
      nextReviewAt: Date.now() + DAY,
    };
    set((s) => {
      const cards = [newCard, ...s.cards];
      saveToStorage('cards', cards);
      return { cards };
    });
    return newCard;
  },

  updateCard: (id, updates) => {
    set((s) => {
      const cards = s.cards.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c));
      saveToStorage('cards', cards);
      return { cards };
    });
  },

  deleteCard: (id) => {
    set((s) => {
      const card = s.cards.find((c) => c.id === id);
      const cards = s.cards.filter((c) => c.id !== id);
      saveToStorage('cards', cards);
      if (card) {
        const log: AuditLog = { id: generateId(), action: 'user_delete', cardId: id, cardTitle: card.title, timestamp: Date.now(), detail: `用户删除了知识卡片「${card.title}」` };
        const auditLogs = [log, ...s.auditLogs];
        saveToStorage('auditLogs', auditLogs);
        return { cards, auditLogs };
      }
      return { cards };
    });
  },

  toggleFavorite: (id) => {
    set((s) => {
      const cards = s.cards.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));
      saveToStorage('cards', cards);
      return { cards };
    });
  },

  markReviewed: (id) => {
    set((s) => {
      const cards = s.cards.map((c) => {
        if (c.id !== id) return c;
        const newCount = c.reviewCount + 1;
        return { ...c, reviewCount: newCount, nextReviewAt: getNextReviewTime(newCount) };
      });
      saveToStorage('cards', cards);
      return { cards };
    });
  },

  addCollection: (colData) => {
    set((s) => {
      const collections = [...s.collections, { ...colData, id: generateId(), createdAt: Date.now() }];
      saveToStorage('collections', collections);
      return { collections };
    });
  },

  updateCollection: (id, updates) => {
    set((s) => {
      const collections = s.collections.map((c) => (c.id === id ? { ...c, ...updates } : c));
      saveToStorage('collections', collections);
      return { collections };
    });
  },

  deleteCollection: (id) => {
    set((s) => {
      const collections = s.collections.filter((c) => c.id !== id);
      const cards = s.cards.map((c) => (c.collectionId === id ? { ...c, collectionId: null } : c));
      saveToStorage('collections', collections);
      saveToStorage('cards', cards);
      return { collections, cards };
    });
  },

  addAuditLog: (logData) => {
    set((s) => {
      const auditLogs = [{ ...logData, id: generateId(), timestamp: Date.now() }, ...s.auditLogs];
      saveToStorage('auditLogs', auditLogs);
      return { auditLogs };
    });
  },

  clearAuditLogs: () => {
    set(() => {
      saveToStorage('auditLogs', []);
      return { auditLogs: [] };
    });
  },

  setPrivacyPreference: (pref) => {
    set((s) => {
      const existing = s.privacyPreferences.filter((p) => p.type !== pref.type);
      const privacyPreferences = [...existing, pref];
      saveToStorage('privacyPrefs', privacyPreferences);
      return { privacyPreferences };
    });
  },

  getPrivacyPreference: (type) => {
    return get().privacyPreferences.find((p) => p.type === type && p.remembered);
  },

  importData: (data) => {
    const state = get();
    const existingCardIds = new Set(state.cards.map((c) => c.id));
    const existingColIds = new Set(state.collections.map((c) => c.id));
    const newCards = (data.cards || []).filter((c) => !existingCardIds.has(c.id));
    const newCols = (data.collections || []).filter((c) => !existingColIds.has(c.id));
    if (newCards.length > 0 || newCols.length > 0) {
      set((s) => {
        const cards = [...newCards, ...s.cards];
        const collections = [...s.collections, ...newCols];
        saveToStorage('cards', cards);
        saveToStorage('collections', collections);
        return { cards, collections };
      });
    }
    return { cardsAdded: newCards.length, collectionsAdded: newCols.length };
  },

  batchDeleteCards: (ids) => {
    set((s) => {
      const idSet = new Set(ids);
      const deleted = s.cards.filter((c) => idSet.has(c.id));
      const cards = s.cards.filter((c) => !idSet.has(c.id));
      saveToStorage('cards', cards);
      const newLogs = deleted.map((c) => ({
        id: generateId(), action: 'user_delete' as const, cardId: c.id,
        cardTitle: c.title, timestamp: Date.now(),
        detail: `批量删除了知识卡片「${c.title}」`,
      }));
      const auditLogs = [...newLogs, ...s.auditLogs];
      saveToStorage('auditLogs', auditLogs);
      return { cards, auditLogs };
    });
  },

  batchUpdatePrivacy: (ids, level) => {
    set((s) => {
      const idSet = new Set(ids);
      const cards = s.cards.map((c) => idSet.has(c.id) ? { ...c, privacyLevel: level, updatedAt: Date.now() } : c);
      saveToStorage('cards', cards);
      return { cards };
    });
  },

  batchMoveCollection: (ids, collectionId) => {
    set((s) => {
      const idSet = new Set(ids);
      const cards = s.cards.map((c) => idSet.has(c.id) ? { ...c, collectionId, updatedAt: Date.now() } : c);
      saveToStorage('cards', cards);
      return { cards };
    });
  },

  getAllTags: () => {
    const tagMap = new Map<string, number>();
    get().cards.forEach((c) => c.tags.forEach((t) => tagMap.set(t, (tagMap.get(t) || 0) + 1)));
    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  },

  getCardsByCollection: (colId) => {
    return get().cards.filter((c) => c.collectionId === colId);
  },

  searchCards: (query) => {
    const q = query.toLowerCase();
    return get().cards.filter(
      (c) =>
        c.privacyLevel !== 'secret' &&
        (c.title.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          c.content.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)) ||
          c.personalNote.toLowerCase().includes(q))
    );
  },
}));
