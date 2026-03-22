export type SourceType = 'url' | 'text' | 'file' | 'note';
export type PrivacyLevel = 'public' | 'private' | 'secret';
export type AuditAction = 'ai_read' | 'ai_summarize' | 'ai_tag' | 'user_modify' | 'user_delete' | 'privacy_change';

export interface KnowledgeCard {
  id: string;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  collectionId: string | null;
  source: string;
  sourceType: SourceType;
  privacyLevel: PrivacyLevel;
  personalNote: string;
  createdAt: number;
  updatedAt: number;
  reviewCount: number;
  nextReviewAt: number;
  isFavorite: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  createdAt: number;
}

export interface AuditLog {
  id: string;
  action: AuditAction;
  cardId: string;
  cardTitle: string;
  timestamp: number;
  detail: string;
}

export interface SensitiveMatch {
  type: string;
  label: string;
  matches: string[];
  indices: [number, number][];
}

export interface PrivacyPreference {
  type: string;
  action: 'encrypt' | 'mask' | 'skip' | 'cancel';
  remembered: boolean;
}
