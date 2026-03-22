import { X, Star, ExternalLink, Clock, Edit3, Trash2, Shield, ShieldAlert, ShieldOff, Eye, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useKnowledgeStore } from '../../../../store/knowledgeStore';
import { useUIStore } from '../../../../store/uiStore';
import type { PrivacyLevel } from '../../../../types';

const PRIVACY_OPTIONS: { value: PrivacyLevel; label: string; desc: string; icon: typeof Shield; color: string }[] = [
  { value: 'public', label: '公开', desc: 'AI可完全读取、摘要、关联', icon: Shield, color: 'text-emerald-500' },
  { value: 'private', label: '私密', desc: 'AI仅读取标题和标签', icon: ShieldAlert, color: 'text-amber-500' },
  { value: 'secret', label: '机密', desc: 'AI完全不可读取', icon: ShieldOff, color: 'text-rose-500' },
];

export default function CardDetail({ cardId }: { cardId: string }) {
  const card = useKnowledgeStore((s) => s.cards.find((c) => c.id === cardId));
  const collections = useKnowledgeStore((s) => s.collections);
  const updateCard = useKnowledgeStore((s) => s.updateCard);
  const deleteCard = useKnowledgeStore((s) => s.deleteCard);
  const toggleFavorite = useKnowledgeStore((s) => s.toggleFavorite);
  const addAuditLog = useKnowledgeStore((s) => s.addAuditLog);
  const closeCardDetail = useUIStore((s) => s.closeCardDetail);
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(card?.personalNote || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!card) return null;

  const collection = collections.find((c) => c.id === card.collectionId);

  const handlePrivacyChange = (level: PrivacyLevel) => {
    updateCard(card.id, { privacyLevel: level });
    addAuditLog({
      action: 'privacy_change',
      cardId: card.id,
      cardTitle: card.title,
      detail: `隐私级别更改为「${PRIVACY_OPTIONS.find((o) => o.value === level)?.label}」`,
    });
  };

  const handleSaveNote = () => {
    updateCard(card.id, { personalNote: noteText });
    setEditingNote(false);
  };

  const handleDelete = () => {
    deleteCard(card.id);
    closeCardDetail();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={closeCardDetail}>
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" />
      <div
        className="relative bg-white rounded-2xl shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-theme-border flex-shrink-0">
          <div className="flex items-center gap-3">
            {collection && (
              <span
                className="text-xs px-2.5 py-1 rounded-lg font-medium"
                style={{ backgroundColor: collection.color + '12', color: collection.color }}
              >
                {collection.icon} {collection.name}
              </span>
            )}
            <span className="text-xs text-stone-400 flex items-center gap-1">
              <Clock size={13} />
              {new Date(card.createdAt).toLocaleDateString('zh-CN')} 创建
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleFavorite(card.id)}
              className="p-2 rounded-lg hover:bg-stone-50 transition-colors"
            >
              <Star size={18} className={card.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-stone-400 hover:text-stone-500'} />
            </button>
            <button onClick={closeCardDetail} className="p-2 rounded-lg hover:bg-stone-50 transition-colors">
              <X size={18} className="text-stone-400 hover:text-stone-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <h2 className="text-lg md:text-xl font-medium text-stone-800 leading-snug">{card.title}</h2>

          {card.privacyLevel === 'secret' ? (
            <div className="flex items-center gap-3 p-4 bg-rose-50/60 rounded-lg text-rose-700 border border-rose-100">
              <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
                <Eye size={20} />
              </div>
              <div>
                <p className="font-medium text-base">此内容已标记为机密</p>
                <p className="text-sm text-rose-500 mt-0.5">AI无法访问，仅在本地加密存储并供本人查看</p>
              </div>
            </div>
          ) : (
            <div className="bg-primary-50/50 border border-primary-100 rounded-lg p-5">
              <h4 className="text-sm font-medium text-primary-700 tracking-wide mb-2 flex items-center gap-1.5">
                <Sparkles size={15} /> AI 摘要
              </h4>
              <p className="text-[15px] text-stone-700 leading-relaxed">{card.summary}</p>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-stone-500 tracking-wide mb-2">完整内容</h4>
            <div className="text-[15px] text-stone-700 leading-relaxed whitespace-pre-wrap bg-stone-50 rounded-lg p-5 max-h-80 overflow-y-auto">
              {card.privacyLevel === 'secret' ? (
                <span className="text-stone-400 italic">机密内容仅在本地加密存储，此处不显示</span>
              ) : (
                card.content
              )}
            </div>
          </div>

          {/* Note section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-stone-500 tracking-wide">我的批注</h4>
              {!editingNote && (
                <button
                  onClick={() => setEditingNote(true)}
                  className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium transition-colors"
                >
                  <Edit3 size={13} /> 编辑批注
                </button>
              )}
            </div>
            {editingNote ? (
              <div className="space-y-3 animate-fadeIn">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full h-28 px-4 py-3 text-[15px] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 resize-none text-stone-800 placeholder:text-stone-400"
                  placeholder="写下你的理解和思考..."
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setEditingNote(false)}
                    className="px-4 py-2 text-sm text-stone-500 hover:bg-stone-50 rounded-lg font-medium transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-1.5 font-medium transition-colors"
                  >
                    <Check size={15} /> 保存批注
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4">
                <p className="text-sm text-amber-900 italic leading-relaxed">
                  {card.personalNote || <span className="text-amber-600/50">暂无批注，点击右上角编辑添加你的理解</span>}
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <h4 className="text-sm font-medium text-stone-500 tracking-wide mb-2">标签</h4>
            <div className="flex flex-wrap gap-1.5">
              {card.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 bg-stone-50 text-stone-500 rounded cursor-default hover:bg-stone-100 transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Privacy selector */}
          <div>
            <h4 className="text-sm font-medium text-stone-500 tracking-wide mb-2">隐私级别</h4>
            <div className="flex flex-col sm:flex-row gap-2">
              {PRIVACY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handlePrivacyChange(opt.value)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border transition-all text-left flex-1 ${
                    card.privacyLevel === opt.value
                      ? 'border-primary-300 bg-primary-50/60'
                      : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    card.privacyLevel === opt.value ? 'bg-white' : 'bg-stone-50'
                  }`}>
                    <opt.icon size={16} className={opt.color} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-700">{opt.label}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {card.source && (
            <a
              href={card.source}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <ExternalLink size={15} /> 查看原文来源
            </a>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-theme-border flex items-center justify-between bg-stone-50/30 rounded-b-2xl flex-shrink-0">
          <div className="text-xs text-stone-400">
            复习 {card.reviewCount} 次 · 上次更新 {new Date(card.updatedAt).toLocaleDateString('zh-CN')}
          </div>
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2 animate-fadeIn">
              <span className="text-xs text-rose-600 font-medium">确认删除？</span>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 text-xs text-stone-500 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 text-xs bg-rose-500 text-white rounded-lg hover:bg-rose-600 font-medium transition-colors"
              >
                确认删除
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
