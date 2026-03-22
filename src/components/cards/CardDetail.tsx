import { X, Star, ExternalLink, Clock, Edit3, Trash2, Shield, ShieldAlert, ShieldOff, Eye, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useKnowledgeStore } from '../../store/knowledgeStore';
import { useUIStore } from '../../store/uiStore';
import type { PrivacyLevel } from '../../types';

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
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-theme-border flex-shrink-0">
          <div className="flex items-center gap-4">
            {collection && (
              <span
                className="text-[14px] px-3.5 py-1.5 rounded-xl font-bold shadow-sm"
                style={{ backgroundColor: collection.color + '15', color: collection.color }}
              >
                {collection.icon} {collection.name}
              </span>
            )}
            <span className="text-[13px] text-stone-400 flex items-center gap-1.5 font-medium bg-stone-50 px-3 py-1.5 rounded-lg">
              <Clock size={14} />
              {new Date(card.createdAt).toLocaleDateString('zh-CN')} 创建
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(card.id)}
              className="p-2 rounded-xl hover:bg-stone-50 transition-colors"
            >
              <Star size={20} className={card.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-stone-400 hover:text-stone-600'} />
            </button>
            <button onClick={closeCardDetail} className="p-2 rounded-xl hover:bg-stone-50 transition-colors">
              <X size={20} className="text-stone-400 hover:text-stone-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          <h2 className="text-2xl md:text-3xl font-black text-stone-900 leading-tight tracking-tight">{card.title}</h2>

          {card.privacyLevel === 'secret' ? (
            <div className="flex items-center gap-4 p-5 bg-rose-50 rounded-2xl text-rose-700 border border-rose-100">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                <Eye size={24} />
              </div>
              <div>
                <p className="font-bold text-base">此内容已标记为机密</p>
                <p className="text-[14px] text-rose-500 mt-1 font-medium">AI无法访问，仅在本地加密存储并供本人查看</p>
              </div>
            </div>
          ) : (
            <div className="bg-primary-50/70 border border-primary-100/50 rounded-2xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-primary-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles size={16} /> AI 摘要
              </h4>
              <p className="text-[15px] text-stone-700 leading-relaxed font-medium">{card.summary}</p>
            </div>
          )}

          <div>
            <h4 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">完整内容</h4>
            <div className="text-[15px] text-stone-700 leading-relaxed whitespace-pre-wrap bg-stone-50 border border-stone-100 rounded-2xl p-6 max-h-80 overflow-y-auto font-medium shadow-inner">
              {card.privacyLevel === 'secret' ? (
                <span className="text-stone-400 italic">机密内容仅在本地加密存储，此处不显示</span>
              ) : (
                card.content
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-stone-500 uppercase tracking-wider">我的批注</h4>
              {!editingNote && (
                <button onClick={() => setEditingNote(true)} className="text-[13px] text-primary-600 hover:text-primary-700 flex items-center gap-1.5 font-bold bg-primary-50 px-3 py-1.5 rounded-lg transition-colors">
                  <Edit3 size={14} /> 编辑批注
                </button>
              )}
            </div>
            {editingNote ? (
              <div className="space-y-3 animate-fadeIn">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full h-32 px-5 py-4 text-[15px] border-2 border-stone-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 resize-none font-medium text-stone-800"
                  placeholder="写下你的理解和思考..."
                />
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setEditingNote(false)} className="px-5 py-2.5 text-[14px] text-stone-600 hover:bg-stone-100 rounded-xl font-bold transition-colors">取消</button>
                  <button onClick={handleSaveNote} className="px-6 py-2.5 text-[14px] bg-primary-600 text-white rounded-xl hover:bg-primary-700 flex items-center gap-2 font-bold shadow-md shadow-primary-600/20 transition-all hover:-translate-y-0.5">
                    <Check size={16} /> 保存批注
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50/80 border border-amber-100/50 rounded-2xl p-5 shadow-sm">
                <p className="text-[15px] text-amber-900 italic font-medium">
                  {card.personalNote || <span className="text-amber-700/60">暂无批注，点击右上角编辑添加你的理解</span>}
                </p>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">标签</h4>
            <div className="flex flex-wrap gap-2">
              {card.tags.map((tag) => (
                <span key={tag} className="text-[13px] px-3 py-1.5 bg-stone-100 text-stone-600 rounded-lg font-bold hover:bg-stone-200 transition-colors cursor-default">{tag}</span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">隐私级别</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PRIVACY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handlePrivacyChange(opt.value)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                    card.privacyLevel === opt.value
                      ? 'border-primary-400 bg-primary-50 shadow-sm ring-2 ring-primary-100'
                      : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${card.privacyLevel === opt.value ? 'bg-white shadow-sm' : 'bg-stone-50'}`}>
                    <opt.icon size={20} className={opt.color} />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-stone-800">{opt.label}</p>
                    <p className="text-[12px] text-stone-500 mt-0.5 font-medium">{opt.desc}</p>
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
              className="inline-flex items-center gap-2 text-[15px] text-primary-600 hover:text-primary-700 font-bold bg-primary-50 px-4 py-2 rounded-xl transition-colors"
            >
              <ExternalLink size={16} /> 查看原文来源
            </a>
          )}
        </div>

        <div className="p-6 border-t border-theme-border flex items-center justify-between bg-stone-50/50 rounded-b-3xl flex-shrink-0">
          <div className="text-[13px] text-stone-500 font-medium">复习 {card.reviewCount} 次 · 上次更新 {new Date(card.updatedAt).toLocaleDateString('zh-CN')}</div>
          {showDeleteConfirm ? (
            <div className="flex items-center gap-3 animate-fadeIn">
              <span className="text-[14px] text-rose-600 font-bold bg-rose-50 px-3 py-1.5 rounded-lg">确认删除？</span>
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 text-[14px] text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl font-bold transition-colors">取消</button>
              <button onClick={handleDelete} className="px-5 py-2 text-[14px] bg-rose-500 text-white rounded-xl hover:bg-rose-600 font-bold shadow-md shadow-rose-500/20 transition-all hover:-translate-y-0.5">确认删除</button>
            </div>
          ) : (
            <button onClick={() => setShowDeleteConfirm(true)} className="p-2.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
