import { useState } from 'react';
import { X, Link, FileText, StickyNote, Upload, Sparkles, Loader2 } from 'lucide-react';
import { useUIStore } from '../../../../store/uiStore';
import { useKnowledgeStore } from '../../../../store/knowledgeStore';
import { generateSummary, generateTags, generateTitle, suggestCollection } from '../../../../utils/mockAI';
import { detectSensitiveInfo, maskSensitiveText } from '../../../../utils/sensitiveDetector';
import type { SourceType, SensitiveMatch } from '../../../../types';
import PrivacyAlertModal from './PrivacyAlertModal';

const SOURCE_TABS: { value: SourceType; icon: typeof Link; label: string }[] = [
  { value: 'url', icon: Link, label: '网页链接' },
  { value: 'text', icon: FileText, label: '粘贴文本' },
  { value: 'note', icon: StickyNote, label: '快速笔记' },
  { value: 'file', icon: Upload, label: '文件上传' },
];

export default function AddKnowledgeModal() {
  const closeAddModal = useUIStore((s) => s.closeAddModal);
  const addCard = useKnowledgeStore((s) => s.addCard);
  const collections = useKnowledgeStore((s) => s.collections);
  const addAuditLog = useKnowledgeStore((s) => s.addAuditLog);
  const getPrivacyPreference = useKnowledgeStore((s) => s.getPrivacyPreference);
  const setPrivacyPreference = useKnowledgeStore((s) => s.setPrivacyPreference);

  const [sourceType, setSourceType] = useState<SourceType>('text');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<{ summary: string; tags: string[]; suggestedCol: string | null } | null>(null);
  const [sensitiveMatches, setSensitiveMatches] = useState<SensitiveMatch[] | null>(null);
  const [pendingContent, setPendingContent] = useState('');

  const handleAIProcess = () => {
    if (!content.trim()) return;
    setProcessing(true);
    setTimeout(() => {
      const matches = detectSensitiveInfo(content);
      if (matches.length > 0) {
        const hasRememberedPref = matches.every((m) => {
          const pref = getPrivacyPreference(m.type);
          return !!pref;
        });

        if (!hasRememberedPref) {
          setSensitiveMatches(matches);
          setPendingContent(content);
          setProcessing(false);
          return;
        }
      }

      runAIAnalysis(content);
    }, 800);
  };

  const runAIAnalysis = (text: string) => {
    const summary = generateSummary(text);
    const tags = generateTags(text);
    const autoTitle = title || generateTitle(text);
    const suggestedCol = suggestCollection(tags, collections);

    setTitle(autoTitle);
    setAiResult({ summary, tags, suggestedCol });
    if (suggestedCol) setCollectionId(suggestedCol);
    setProcessing(false);
  };

  const handlePrivacyConfirm = (action: 'encrypt' | 'mask' | 'skip' | 'cancel', remember: boolean) => {
    if (action === 'cancel') {
      setSensitiveMatches(null);
      setPendingContent('');
      return;
    }

    if (remember && sensitiveMatches) {
      for (const m of sensitiveMatches) {
        setPrivacyPreference({ type: m.type, action, remembered: true });
      }
    }

    setSensitiveMatches(null);
    let processedContent = pendingContent;

    if (action === 'mask' && sensitiveMatches) {
      processedContent = maskSensitiveText(pendingContent, sensitiveMatches);
    } else if (action === 'skip' && sensitiveMatches) {
      processedContent = maskSensitiveText(pendingContent, sensitiveMatches);
    }

    setContent(processedContent);
    runAIAnalysis(processedContent);
  };

  const handleSubmit = () => {
    if (!content.trim() || !title.trim()) return;

    const isSecret = detectSensitiveInfo(content).length > 0;
    const card = addCard({
      title,
      content,
      summary: aiResult?.summary || '',
      tags: aiResult?.tags || [],
      collectionId,
      source,
      sourceType,
      privacyLevel: isSecret ? 'secret' : 'public',
      personalNote: '',
      isFavorite: false,
    });

    if (card.privacyLevel !== 'secret') {
      addAuditLog({ action: 'ai_summarize', cardId: card.id, cardTitle: card.title, detail: 'AI为知识卡片生成了摘要' });
      addAuditLog({ action: 'ai_tag', cardId: card.id, cardTitle: card.title, detail: `AI自动生成了标签：${(aiResult?.tags || []).join(', ')}` });
    }

    closeAddModal();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={closeAddModal}>
        <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm transition-opacity" />
        <div
          className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl animate-scaleIn flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-5 border-b border-stone-100 flex-shrink-0">
            <h3 className="text-lg font-medium text-stone-800">添加知识</h3>
            <button onClick={closeAddModal} className="p-2 rounded-lg hover:bg-stone-50 transition-colors">
              <X size={20} className="text-stone-400 hover:text-stone-600" />
            </button>
          </div>

          <div className="p-5 space-y-5 overflow-y-auto flex-1">
            <div className="flex gap-2 bg-stone-50 p-1 rounded-lg">
              {SOURCE_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSourceType(tab.value)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium transition-all ${
                    sourceType === tab.value
                      ? 'bg-white text-primary-700 shadow-sm border border-stone-200/60'
                      : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100/50'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-3.5">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="标题（AI可自动生成）"
                className="w-full px-4 py-3 text-base border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 bg-white transition-all font-medium text-stone-700 placeholder:text-stone-300"
              />

              {sourceType === 'url' && (
                <input
                  type="url"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="粘贴网页链接，如 https://..."
                  className="w-full px-4 py-3 text-base border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 bg-white transition-all font-medium text-stone-700 placeholder:text-stone-300"
                />
              )}

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  sourceType === 'url'
                    ? '粘贴网页正文或由AI自动提取...'
                    : sourceType === 'note'
                    ? '写下你的想法和灵感...'
                    : '粘贴你要收藏的内容...'
                }
                className="w-full h-48 px-4 py-3.5 text-base border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 bg-white transition-all resize-none leading-relaxed font-medium text-stone-700 placeholder:text-stone-300"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <select
                value={collectionId || ''}
                onChange={(e) => setCollectionId(e.target.value || null)}
                className="flex-1 px-4 py-3 text-base font-medium border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 bg-white hover:bg-stone-50/50 transition-all text-stone-600 cursor-pointer"
              >
                <option value="">选择知识集（可选）</option>
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.icon} {col.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAIProcess}
                disabled={!content.trim() || processing}
                className="flex items-center justify-center gap-2 px-5 py-3 border border-primary-400 text-primary-600 bg-primary-50 text-base font-medium rounded-lg hover:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all sm:w-auto w-full"
              >
                {processing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                AI 智能分析
              </button>
            </div>

            {aiResult && (
              <div className="bg-primary-50/30 border border-primary-100 rounded-lg p-4 space-y-3.5 animate-fadeIn">
                <div>
                  <h4 className="text-sm font-medium text-primary-600 tracking-wide mb-1.5 flex items-center gap-1.5">
                    <Sparkles size={14} /> AI 摘要
                  </h4>
                  <p className="text-base text-stone-600 leading-relaxed">{aiResult.summary}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-primary-600 tracking-wide mb-1.5">自动标签</h4>
                  <div className="flex flex-wrap gap-2">
                    {aiResult.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-sm px-2.5 py-1 bg-white text-primary-700 border border-primary-100 rounded-lg font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 p-5 border-t border-stone-100 flex-shrink-0">
            <button
              onClick={closeAddModal}
              className="px-5 py-2.5 text-base text-stone-500 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg transition-colors font-medium"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || !title.trim()}
              className="px-5 py-2.5 text-base bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              添加到知识库
            </button>
          </div>
        </div>
      </div>

      {sensitiveMatches && (
        <PrivacyAlertModal
          matches={sensitiveMatches}
          originalText={pendingContent}
          onConfirm={handlePrivacyConfirm}
        />
      )}
    </>
  );
}
