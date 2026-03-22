import { create } from 'zustand';

export type ThemeId = 'v1' | 'v2';

interface UIState {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  toggleTheme: () => void;

  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  addModalOpen: boolean;
  openAddModal: () => void;
  closeAddModal: () => void;

  detailCardId: string | null;
  openCardDetail: (id: string) => void;
  closeCardDetail: () => void;

  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;

  onboardingDone: boolean;
  onboardingStep: number;
  startOnboarding: () => void;
  nextOnboardingStep: () => void;
  prevOnboardingStep: () => void;
  finishOnboarding: () => void;

  batchMode: boolean;
  selectedCardIds: Set<string>;
  enterBatchMode: () => void;
  exitBatchMode: () => void;
  toggleCardSelection: (id: string) => void;
  selectAllCards: (ids: string[]) => void;
  clearSelection: () => void;
}

const stored = (typeof localStorage !== 'undefined' && localStorage.getItem('ui-theme')) as ThemeId | null;
const onboardingDone = typeof localStorage !== 'undefined' && localStorage.getItem('onboarding-done') === '1';

export const useUIStore = create<UIState>((set) => ({
  theme: stored === 'v2' ? 'v2' : 'v1',
  setTheme: (t) => { localStorage.setItem('ui-theme', t); set({ theme: t }); },
  toggleTheme: () => set((s) => {
    const next = s.theme === 'v1' ? 'v2' : 'v1';
    localStorage.setItem('ui-theme', next);
    return { theme: next };
  }),

  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  addModalOpen: false,
  openAddModal: () => set({ addModalOpen: true }),
  closeAddModal: () => set({ addModalOpen: false }),

  detailCardId: null,
  openCardDetail: (id) => set({ detailCardId: id }),
  closeCardDetail: () => set({ detailCardId: null }),

  viewMode: 'grid',
  setViewMode: (mode) => set({ viewMode: mode }),

  onboardingDone,
  onboardingStep: 0,
  startOnboarding: () => set({ onboardingDone: false, onboardingStep: 0 }),
  nextOnboardingStep: () => set((s) => ({ onboardingStep: s.onboardingStep + 1 })),
  prevOnboardingStep: () => set((s) => ({ onboardingStep: Math.max(0, s.onboardingStep - 1) })),
  finishOnboarding: () => {
    localStorage.setItem('onboarding-done', '1');
    set({ onboardingDone: true, onboardingStep: 0 });
  },

  batchMode: false,
  selectedCardIds: new Set(),
  enterBatchMode: () => set({ batchMode: true, selectedCardIds: new Set() }),
  exitBatchMode: () => set({ batchMode: false, selectedCardIds: new Set() }),
  toggleCardSelection: (id) => set((s) => {
    const next = new Set(s.selectedCardIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    return { selectedCardIds: next };
  }),
  selectAllCards: (ids) => set({ selectedCardIds: new Set(ids) }),
  clearSelection: () => set({ selectedCardIds: new Set() }),
}));
